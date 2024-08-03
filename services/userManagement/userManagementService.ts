export default interface UserManagementService {
  createUser(email: string, password: string): Promise<string>;
  
  login(email: string, password: string): Promise<string>;
  
  logout(): Promise<void>;
}