import ValidationService from "@/services/validation/validationService";
import { mock, MockProxy } from "jest-mock-extended";
import UserManagementService from "@/services/userManagement/userManagementService";
import ServiceRegistry from "@/services/serviceRegistry";
import { NextApiRequest, NextApiResponse } from "next";
import { POST } from "@/app/api/signup/route";
import { setCookie } from "nookies";

jest.mock("nookies", () => ({
  setCookie: jest.fn(),
}));

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
        
        const request = { body: { email: "bugcat@capoo", password: "password1234" } } as unknown as NextApiRequest;
        const json = jest.fn();
        const status = jest.fn(() => ({ json }));
        const response = { status } as unknown as NextApiResponse;
        
        await POST(request, response);
        
        expect(mockValidationService.isValidEmail).toHaveBeenCalledWith("bugcat@capoo");
        expect(status).toHaveBeenCalledWith(400);
        expect(json).toHaveBeenCalledWith({ error: "Invalid email address." });
      });
    });
    
    describe("When the provided password is not valid", () => {
      it("Should return a 400 error message explaining the invalid password", async () => {
        mockValidationService.isValidEmail.mockReturnValue(true);
        mockValidationService.isStrongPassword.mockReturnValue(false);
        
        const request = { body: { email: "bugcat@capoo.com", password: "112233" } } as unknown as NextApiRequest;
        const json = jest.fn();
        const status = jest.fn(() => ({ json }));
        const response = { status } as unknown as NextApiResponse;
        
        await POST(request, response);
        
        expect(mockValidationService.isStrongPassword).toHaveBeenCalledWith("112233");
        expect(status).toHaveBeenCalledWith(400);
        expect(json).toHaveBeenCalledWith({ error: "Please use a password with at least 8 characters and at least one uppercase character, lowercase character and symbol." });
      });
    });
    
    describe("When the sign up process succeeds", () => {
      it("Should invoke the user management service and return a 200 success message", async () => {
        mockValidationService.isValidEmail.mockReturnValue(true);
        mockValidationService.isStrongPassword.mockReturnValue(true);
        mockUserManagementService.createUser.mockResolvedValue("some-id-token");
        
        const request = { body: { email: "bugcat@capoo.com", password: "Password1234$" } } as unknown as NextApiRequest;
        const json = jest.fn();
        const status = jest.fn(() => ({ json }));
        const response = { status } as unknown as NextApiResponse;
        
        await POST(request, response);
        
        expect(mockUserManagementService.createUser).toHaveBeenCalledWith("bugcat@capoo.com", "Password1234$");
        expect(status).toHaveBeenCalledWith(200);
        expect(json).toHaveBeenCalledWith({ message: "Signed up successfully." });
      });
      
      it("Should set the received user id token as a cookie", async () => {
        mockValidationService.isValidEmail.mockReturnValue(true);
        mockValidationService.isStrongPassword.mockReturnValue(true);
        mockUserManagementService.createUser.mockResolvedValue("another-id-token");
        
        const request = { body: { email: "bugcat@capoo.com", password: "Password1234$" } } as unknown as NextApiRequest;
        const json = jest.fn();
        const status = jest.fn(() => ({ json }));
        const response = { status } as unknown as NextApiResponse;
        
        await POST(request, response);
        
        expect(setCookie).toHaveBeenCalledWith({ res: response }, "token", "another-id-token", {
          maxAge: 30 * 24 * 60 * 60,
          path: "/",
        });
      });
    });
    
    describe("When the sign up process fails", () => {
      it("Should return a 500 server error", async () => {
        mockValidationService.isValidEmail.mockReturnValue(true);
        mockValidationService.isStrongPassword.mockReturnValue(true);
        mockUserManagementService.createUser.mockRejectedValue("test error, don't be alarmed");
        
        const request = { body: { email: "bugcat@capoo.com", password: "Password1234$" } } as unknown as NextApiRequest;
        const json = jest.fn();
        const status = jest.fn(() => ({ json }));
        const response = { status } as unknown as NextApiResponse;
        
        await POST(request, response);
        
        expect(status).toHaveBeenCalledWith(500);
        expect(json).toHaveBeenCalledWith({ error: "There was an error signing up." });
      });
    });
  });
});