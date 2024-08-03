import ServiceRegistry from "@/services/serviceRegistry";
import SignupRequest from "@/app/api/signup/signupRequest";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest): Promise<NextResponse> {
  const validationService = ServiceRegistry.getValidationService();
  const userManagementService = ServiceRegistry.getUserManagementService();
  
  const requestBody = await request.json() as SignupRequest;
  
  if (!validationService.isValidEmail(requestBody.email)) {
    return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
  }
  
  if (!validationService.isStrongPassword(requestBody.password)) {
    return NextResponse.json({
      error: "Please use a password with at least 8 characters and at least one uppercase character, lowercase character and symbol."
    }, { status: 400 });
  }
  
  try {
    const userIdToken = await userManagementService.createUser(requestBody.email, requestBody.password);
    
    const response = NextResponse.json({ message: "Signed up successfully." }, { status: 200 });
    
    response.cookies.set("token", userIdToken, {
      maxAge: 30 * 24 * 60 * 60,
      path: "/",
    });
    
    return response;
  } catch {
    return NextResponse.json({ error: "There was an error signing up." }, { status: 500 });
  }
}