import ValidationService from "@/services/validation/validationService";
import { StrongPasswordOptions } from "validator";

export default class NodeValidationService implements ValidationService {
  private readonly isEmailDelegate: (email: string) => boolean;
  private readonly isStrongPasswordDelegate: (password: string, isStrongPasswordOptions?: StrongPasswordOptions) => boolean;
  
  constructor(
    isEmailDelegate: (email: string) => boolean,
    isStrongPasswordDelegate: (password: string, isStrongPasswordOptions?: StrongPasswordOptions) => boolean
  ) {
    this.isEmailDelegate = isEmailDelegate;
    this.isStrongPasswordDelegate = isStrongPasswordDelegate;
  }
  
  isValidEmail(email: string): boolean {
    return this.isEmailDelegate(email);
  }
  
  isStrongPassword(password: string): boolean {
    return this.isStrongPasswordDelegate(password, {
      minLength: 8,
      minUppercase: 1,
      minLowercase: 1,
      minSymbols: 1
    });
  }
}