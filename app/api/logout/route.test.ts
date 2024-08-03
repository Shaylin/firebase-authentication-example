import { mock, MockProxy } from "jest-mock-extended";
import UserManagementService from "@/services/userManagement/userManagementService";
import ServiceRegistry from "@/services/serviceRegistry";
import { POST } from "@/app/api/logout/route";
import { NextRequest } from "next/server";

describe("Logout route", () => {
  let mockUserManagementService: MockProxy<UserManagementService>;
  
  beforeEach(() => {
    mockUserManagementService = mock<UserManagementService>();
    
    ServiceRegistry.getUserManagementService = jest.fn().mockReturnValue(mockUserManagementService);
  });
  
  describe("POST", () => {
    it("Should invoke the user management service and mark the user id cookie for deletion", async () => {
      const request = {
        json: async () => {
          return { email: "bugcat@capoo.com", password: "Password1234$" }
        }
      };
      
      const response = await POST(request as unknown as NextRequest);
      const cookie = response.cookies.get("token");
      
      expect(cookie!.maxAge).toBe(-1);
      expect(cookie!.name).toBe("token");
      expect(cookie!.value).toBe("deleted");
      
      expect(mockUserManagementService.logout).toHaveBeenCalled();
      expect(response.status).toBe(200);
      expect(await response.json()).toEqual({ message: "Logged out." });
    });
  });
})