import { NextRequest, NextResponse } from "next/server";
import EditPasswordRequest from "@/app/api/password/editPasswordRequest";
import ServiceRegistry from "@/services/serviceRegistry";

export async function PUT(request: NextRequest): Promise<NextResponse> {
  const userManagementService = ServiceRegistry.getUserManagementService();
  const validationService = ServiceRegistry.getValidationService();
  
  const requestBody = await request.json() as EditPasswordRequest;
  
  if (!validationService.isStrongPassword(requestBody.password)) {
    return NextResponse.json({
      error: "Please use a password with at least 8 characters and at least one uppercase character, lowercase character and symbol."
    }, { status: 400 });
  }
  
  try {
    await userManagementService.updatePassword(requestBody.email, requestBody.password);
    
    return NextResponse.json({ message: "Password update successful." }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Password update failed." }, { status: 500 });
  }
}