import NodeValidationService from "@/services/validation/nodeValidationService";

describe("Node Validation Service", () => {
  let validationService: NodeValidationService;
  let mockEmailValidator = jest.fn();
  let mockPasswordValidator = jest.fn();
  
  beforeEach(() => {
    validationService = new NodeValidationService(mockEmailValidator, mockPasswordValidator);
  });
  
  describe("Constructor", () => {
    it("Should construct", () => {
      expect(validationService).toBeInstanceOf(NodeValidationService);
    });
  });
  
  describe("isValidEmail", () => {
    describe("When the validation delegate returns true", () => {
      it("Should return true", () => {
        mockEmailValidator.mockReturnValue(true);
        
        const result = validationService.isValidEmail("bugcat@capoo.com");
        
        expect(mockEmailValidator).toHaveBeenCalledWith("bugcat@capoo.com");
        
        expect(result).toBe(true);
      });
    });
    
    describe("When the validation delegate returns false", () => {
      it("Should return false", () => {
        mockEmailValidator.mockReturnValue(false);
        
        const result = validationService.isValidEmail("bugcatzzz+alias@capoo.com");
        
        expect(mockEmailValidator).toHaveBeenCalledWith("bugcatzzz+alias@capoo.com");
        
        expect(result).toBe(false);
      });
    });
  });
  
  describe("isStrongPassword", () => {
    describe("When the validation delegate returns true", () => {
      it("Should return true", () => {
        mockPasswordValidator.mockReturnValue(true);
        
        const result = validationService.isStrongPassword("S1CsemperTyrann!s");
        
        expect(mockPasswordValidator).toHaveBeenCalledWith("S1CsemperTyrann!s", {
          minLength: 8,
          minUppercase: 1,
          minLowercase: 1,
          minSymbols: 1
        });
        
        expect(result).toBe(true);
      });
    });
    
    describe("When the validation delegate returns false", () => {
      it("Should return false", () => {
        mockPasswordValidator.mockReturnValue(false);
        
        const result = validationService.isStrongPassword("password1234");
        
        expect(mockPasswordValidator).toHaveBeenCalledWith("password1234", {
          minLength: 8,
          minUppercase: 1,
          minLowercase: 1,
          minSymbols: 1
        });
        
        expect(result).toBe(false);
      });
    });
  });
  
})