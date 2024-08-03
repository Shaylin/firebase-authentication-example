import { mock, MockProxy } from "jest-mock-extended";
import UserManagementService from "@/services/userManagement/userManagementService";
import ServiceRegistry from "@/services/serviceRegistry";
import { POST } from "@/app/api/verifyUser/route";
import { NextRequest } from "next/server";

describe("Verify User Route", () => {
  let mockUserManagementService: MockProxy<UserManagementService>;
  
  beforeEach(() => {
    mockUserManagementService = mock<UserManagementService>();
    
    ServiceRegistry.getUserManagementService = jest.fn().mockReturnValue(mockUserManagementService);
  });
  
  describe("POST", () => {
    describe("When the user verification successful", () => {
      it("Should invoke the user management service and return a 200 response", async () => {
        mockUserManagementService.verifyUser.mockResolvedValue(true);
        
        const request = {
          json: async () => {
            return { userIdToken: "12341234" }
          }
        };
        
        const response = await POST(request as unknown as NextRequest);
        
        expect(mockUserManagementService.verifyUser).toHaveBeenCalledWith("12341234");
        
        expect(response.status).toBe(200);
        expect(await response.json()).toEqual({ message: "Verification successful." });
      });
    });
    
    describe("When the user verification fails", () => {
      it("Should return a 400 response", async () => {
        mockUserManagementService.verifyUser.mockResolvedValue(false);
        
        const request = {
          json: async () => {
            return { userIdToken: "12341234" }
          }
        };
        
        const response = await POST(request as unknown as NextRequest);
        
        expect(mockUserManagementService.verifyUser).toHaveBeenCalledWith("12341234");
        
        expect(response.status).toBe(400);
        expect(await response.json()).toEqual({ error: "User Verification failed." });
      });
    });
  });
})