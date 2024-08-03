import ValidationService from "@/services/validation/validationService";
import { mock, MockProxy } from "jest-mock-extended";
import UserManagementService from "@/services/userManagement/userManagementService";
import ServiceRegistry from "@/services/serviceRegistry";
import { NextRequest } from "next/server";
import { POST } from "@/app/api/login/route";

describe("Login route", () => {
  let mockUserManagementService: MockProxy<UserManagementService>;
  let mockValidationService: MockProxy<ValidationService>;
  
  beforeEach(() => {
    mockUserManagementService = mock<UserManagementService>();
    mockValidationService = mock<ValidationService>();
    
    ServiceRegistry.getValidationService = jest.fn().mockReturnValue(mockValidationService);
    ServiceRegistry.getUserManagementService = jest.fn().mockReturnValue(mockUserManagementService);
  });
  
  describe("POST", () => {
    describe("When the provided email is not valid", () => {
      it("Should return a 400 error message explaining the invalid email", async () => {
        mockValidationService.isValidEmail.mockReturnValue(false);
        
        const request = {
          json: async () => {
            return { email: "bugcat@mika", password: "password1234" }
          }
        }
        
        const response = await POST(request as unknown as NextRequest);
        
        expect(mockValidationService.isValidEmail).toHaveBeenCalledWith("bugcat@mika");
        
        expect(await response.json()).toEqual({ error: "Invalid email address." });
        expect(response.status).toBe(400);
      });
    });
    
    describe("When the login process succeeds", () => {
      it("Should invoke the user management service, store a cookie with the user id token and return a 200 success message", async () => {
        mockValidationService.isValidEmail.mockReturnValue(true);
        mockUserManagementService.login.mockResolvedValue("some-id-token");
        
        const request = {
          json: async () => {
            return { email: "bugcat@capoo.za", password: "Password1234$" }
          }
        }
        
        const response = await POST(request as unknown as NextRequest);
        
        const cookie = response.cookies.get("token")
        
        expect(cookie!.maxAge).toBe(2592000);
        expect(cookie!.name).toBe("token");
        expect(cookie!.value).toBe("some-id-token");
        
        expect(mockUserManagementService.login).toHaveBeenCalledWith("bugcat@capoo.za", "Password1234$");
        expect(response.status).toBe(200);
        expect(await response.json()).toEqual({ message: "Login successful." });
      });
    });
    
    describe("When the login process fails", () => {
      it("Should return a 401 error with a login failed message", async () => {
        mockValidationService.isValidEmail.mockReturnValue(true);
        mockUserManagementService.login.mockRejectedValue("test error, don't be alarmed");
        
        const request = {
          json: async () => {
            return { email: "bugcat@capoo.com", password: "Password1234$" }
          }
        }
        
        const response = await POST(request as unknown as NextRequest);
        
        expect(response.status).toBe(401);
        expect(await response.json()).toEqual({ error: "Login failed. Please ensure you have entered the correct email and password." });
      });
    });
  });
});