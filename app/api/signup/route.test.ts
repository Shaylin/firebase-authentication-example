import ValidationService from "@/services/validation/validationService";
import { mock, MockProxy } from "jest-mock-extended";
import UserManagementService from "@/services/userManagement/userManagementService";
import ServiceRegistry from "@/services/serviceRegistry";
import { NextRequest } from "next/server";
import { POST } from "@/app/api/signup/route";

describe("Signup route", () => {
  let mockValidationService: MockProxy<ValidationService>;
  let mockUserManagementService: MockProxy<UserManagementService>;
  
  beforeEach(() => {
    mockValidationService = mock<ValidationService>();
    mockUserManagementService = mock<UserManagementService>();
    
    ServiceRegistry.getValidationService = jest.fn().mockReturnValue(mockValidationService);
    ServiceRegistry.getUserManagementService = jest.fn().mockReturnValue(mockUserManagementService);
  });
  
  describe("POST", () => {
    describe("When the provided email is not valid", () => {
      it("Should return a 400 error message explaining the invalid email", async () => {
        mockValidationService.isValidEmail.mockReturnValue(false);
        
        const request = {
          json: async () => {
            return { email: "bugcat@capoo", password: "password1234" }
          }
        }
        
        const response = await POST(request as unknown as NextRequest);
        
        expect(mockValidationService.isValidEmail).toHaveBeenCalledWith("bugcat@capoo");
        
        expect(await response.json()).toEqual({ error: "Invalid email address." });
        expect(response.status).toBe(400);
      });
    });
    
    describe("When the provided password is not valid", () => {
      it("Should return a 400 error message explaining the invalid password", async () => {
        mockValidationService.isValidEmail.mockReturnValue(true);
        mockValidationService.isStrongPassword.mockReturnValue(false);
        
        const request = {
          json: async () => {
            return { email: "bugcat@capoo", password: "112233" }
          }
        }
        
        const response = await POST(request as unknown as NextRequest);
        
        expect(mockValidationService.isStrongPassword).toHaveBeenCalledWith("112233");
        expect(await response.json()).toEqual({ error: "Please use a password with at least 8 characters and at least one uppercase character, lowercase character and symbol." });
        expect(response.status).toBe(400);
      });
    });
    
    describe("When the sign up process succeeds", () => {
      it("Should invoke the user management service and return a 200 success message", async () => {
        mockValidationService.isValidEmail.mockReturnValue(true);
        mockValidationService.isStrongPassword.mockReturnValue(true);
        mockUserManagementService.createUser.mockResolvedValue("some-id-token");
        
        const request = {
          json: async () => {
            return { email: "bugcat@capoo.com", password: "Password1234$" }
          }
        }
        
        const response = await POST(request as unknown as NextRequest);
        
        expect(mockUserManagementService.createUser).toHaveBeenCalledWith("bugcat@capoo.com", "Password1234$");
        expect(response.status).toBe(200);
        expect(await response.json()).toEqual({ message: "Signed up successfully." });
      });
      
      it("Should set the received user id token as a cookie", async () => {
        mockValidationService.isValidEmail.mockReturnValue(true);
        mockValidationService.isStrongPassword.mockReturnValue(true);
        mockUserManagementService.createUser.mockResolvedValue("another-id-token");
        
        const request = {
          json: async () => {
            return { email: "bugcat@capoo.com", password: "Password1234$" }
          }
        }
        
        const response = await POST(request as unknown as NextRequest);
        const cookie = response.cookies.get("token")
        
        expect(cookie!.maxAge).toBe(2592000);
        expect(cookie!.name).toBe("token");
        expect(cookie!.value).toBe("another-id-token");
      });
    });
    
    describe("When the sign up process fails", () => {
      it("Should return a 500 server error", async () => {
        mockValidationService.isValidEmail.mockReturnValue(true);
        mockValidationService.isStrongPassword.mockReturnValue(true);
        mockUserManagementService.createUser.mockRejectedValue("test error, don't be alarmed");
        
        const request = {
          json: async () => {
            return { email: "bugcat@capoo.com", password: "Password1234$" }
          }
        }
        
        const response = await POST(request as unknown as NextRequest);
        
        expect(response.status).toBe(500);
        expect(await response.json()).toEqual({ error: "There was an error signing up." });
      });
    });
  });
});