import { mock, MockProxy } from "jest-mock-extended";
import UserManagementService from "@/services/userManagement/userManagementService";
import ServiceRegistry from "@/services/serviceRegistry";
import { PUT } from "@/app/api/password/route";
import { NextRequest } from "next/server";
import ValidationService from "@/services/validation/validationService";

describe("Edit Password Route", () => {
  let mockUserManagementService: MockProxy<UserManagementService>;
  let mockValidationService: MockProxy<ValidationService>;
  
  beforeEach(() => {
    mockUserManagementService = mock<UserManagementService>();
    mockValidationService = mock<ValidationService>();
    
    ServiceRegistry.getUserManagementService = jest.fn().mockReturnValue(mockUserManagementService);
    ServiceRegistry.getValidationService = jest.fn().mockReturnValue(mockValidationService);
  });
  
  describe("PUT", () => {
    describe("When the password edit succeeds", () => {
      it("Should invoke the user management service and return a 200 response", async () => {
        mockValidationService.isStrongPassword.mockReturnValue(true);
        
        const request = {
          json: async () => {
            return { userIdToken: "tooken", password: "Password1234$" }
          }
        };
        
        const response = await PUT(request as unknown as NextRequest);
        
        expect(mockValidationService.isStrongPassword).toHaveBeenCalledWith("Password1234$");
        expect(mockUserManagementService.updatePassword).toHaveBeenCalledWith("tooken", "Password1234$");
        
        expect(response.status).toBe(200);
        expect(await response.json()).toEqual({ message: "Password update successful." });
      });
    });
    
    describe("When password validation fails", () => {
      it("should return a 400 error", async () => {
        mockValidationService.isStrongPassword.mockReturnValue(false);
        
        const request = {
          json: async () => {
            return { useridToken: "name@domain.com", password: "password1234$" }
          }
        };
        
        const response = await PUT(request as unknown as NextRequest);
        
        expect(mockValidationService.isStrongPassword).toHaveBeenCalledWith("password1234$");
        expect(mockUserManagementService.updatePassword).not.toHaveBeenCalled();
        
        
        expect(response.status).toBe(400);
      });
    });
    
    describe("When the password edit fails", () => {
      it("Should return a 400 response", async () => {
        mockValidationService.isStrongPassword.mockReturnValue(true);
        mockUserManagementService.updatePassword.mockRejectedValue("test error, don't be alarmed");
        
        const request = {
          json: async () => {
            return { userIdToken: "name@domain.com", password: "PAssword1234$" }
          }
        };
        
        const response = await PUT(request as unknown as NextRequest);
        
        expect(mockValidationService.isStrongPassword).toHaveBeenCalledWith("PAssword1234$");
        
        expect(response.status).toBe(500);
        expect(await response.json()).toEqual({ error: "Password update failed." });
      });
    });
  });
})