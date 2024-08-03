import { NextRequest, NextResponse } from "next/server";
import ServiceRegistry from "@/services/serviceRegistry";
import SignupRequest from "@/app/api/signup/signupRequest";

export async function POST(request: NextRequest): Promise<NextResponse> {
  const validationService = ServiceRegistry.getValidationService();
  const userManagementService = ServiceRegistry.getUserManagementService();
  
  const requestBody = await request.json() as SignupRequest;
  
  if (!validationService.isValidEmail(requestBody.email)) {
    return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
  }
  
  try {
    const userIdToken = await userManagementService.login(requestBody.email, requestBody.password);
    
    const response = NextResponse.json({ message: "Login successful." }, { status: 200 });
    
    response.cookies.set("token", userIdToken, {
      maxAge: 30 * 24 * 60 * 60,
      path: "/",
    });
    
    return response;
  } catch {
    return NextResponse.json({ error: "Login failed. Please ensure you have entered the correct email and password." }, { status: 401 });
  }
}