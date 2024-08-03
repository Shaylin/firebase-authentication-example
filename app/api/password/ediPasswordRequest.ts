import { NextRequest, NextResponse } from "next/server";
import ServiceRegistry from "@/services/serviceRegistry";
import EditPasswordRequest from "@/app/api/password/editPasswordRequest";

export async function PUT(request: NextRequest): Promise<NextResponse> {
  const userManagementService = ServiceRegistry.getUserManagementService();
  
  const requestBody = await request.json() as EditPasswordRequest;
  
  try {
    await userManagementService.updatePassword(requestBody.email, requestBody.password);
    
    return NextResponse.json({ message: "Update successful." }, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Password update failed." }, { status: 400 });
  }
}