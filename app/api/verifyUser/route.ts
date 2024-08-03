import { NextRequest, NextResponse } from "next/server";
import ServiceRegistry from "@/services/serviceRegistry";
import VerificationRequest from "@/app/api/verifyUser/verificationRequest";

export async function POST(request: NextRequest): Promise<NextResponse> {
  const userManagementService = ServiceRegistry.getUserManagementService();
  
  const requestBody = await request.json() as VerificationRequest;
  
  try {
    const verificationResult = await userManagementService.verifyUser(requestBody.userIdToken);
    
    if (!verificationResult) {
      return NextResponse.json({ error: "User Verification failed." }, { status: 400 });
    }
    
    return NextResponse.json({ message: "Verification successful." }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "User Verification failed." }, { status: 400 });
  }
}