export default interface UserManagementService {
  createUser(email: string, password: string): Promise<string>;
  
  login(email: string, password: string): Promise<string>;
  
  verifyUser(userIdToken: string): Promise<boolean>;
  
  updatePassword(userIdToken: string, newPassword: string): Promise<void>;
  
  logout(): Promise<void>;
}