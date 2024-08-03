import { NextRequest, NextResponse } from "next/server";
import ServiceRegistry from "@/services/serviceRegistry";


export async function POST(request: NextRequest): Promise<NextResponse> {
  const userManagementService = ServiceRegistry.getUserManagementService();
  
  await userManagementService.logout();
  
  const response = NextResponse.json({ message: "Logged out." }, { status: 200 });
  
  response.cookies.set("token", "deleted", {
    maxAge: -1,
    path: "/",
  });
  
  return response;
}