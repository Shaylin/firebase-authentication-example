import ServiceRegistry from "@/services/serviceRegistry";
import SignupRequest from "@/app/api/signup/signupRequest";
import { setCookie } from "nookies";
import { NextApiRequest, NextApiResponse } from "next";

export async function POST(request: NextApiRequest, response: NextApiResponse) {
  const validationService = ServiceRegistry.getValidationService();
  const userManagementService = ServiceRegistry.getUserManagementService();
  
  const requestBody = request.body as SignupRequest;
  
  if (!validationService.isValidEmail(requestBody.email)) {
    response.status(400).json({ error: "Invalid email address." });
  }
  
  if (!validationService.isStrongPassword(requestBody.password)) {
    response.status(400).json({
      error: "Please use a password with at least 8 characters and at least one uppercase character, lowercase character and symbol."
    });
  }
  
  try {
    const userIdToken = await userManagementService.createUser(requestBody.email, requestBody.password);
    
    setCookie({ res: response }, "token", userIdToken, {
      maxAge: 30 * 24 * 60 * 60,
      path: "/",
    });
    
    response.status(200).json({ message: "Signed up successfully." });
  } catch {
    response.status(500).json({ error: "There was an error signing up." });
  }
}