export default interface ValidationService {
  isValidEmail(email: string): boolean;
  
  isStrongPassword(email: string): boolean;
}