import ValidationService from "@/services/validation/validationService";
import NodeValidationService from "@/services/validation/nodeValidationService";
import validator, { StrongPasswordOptions } from "validator";
import UserManagementService from "@/services/userManagement/userManagementService";
import FirebaseUserManagementService from "@/services/userManagement/firebaseUserManagementService";
import { initializeApp } from "@firebase/app";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, getAuth } from "firebase/auth";
import admin, { ServiceAccount } from "firebase-admin";

export default class ServiceRegistry {
  private static validationService: ValidationService;
  private static userManagementService: UserManagementService;
  
  public static getValidationService(): ValidationService {
    if (this.validationService == null) {
      this.validationService = new NodeValidationService(
        validator.isEmail,
        validator.isStrongPassword as unknown as (password: string, isStrongPasswordOptions?: StrongPasswordOptions) => boolean
      );
    }
    
    return this.validationService;
  }
  
  public static getUserManagementService(): UserManagementService {
    if (this.userManagementService == null) {
      const adminApp = admin.apps.length ? admin.apps[0] : admin.initializeApp({
        credential: admin.credential.cert({
          type: "service_account",
          project_id: process.env.FIREBASE_PROJECT_ID,
          private_key_id: process.env.FIREBASE_ADMIN_PRIVATE_KEY_ID,
          private_key: process.env.FIREBASE_ADMIN_PRIVATE_KEY,
          client_email: process.env.FIREBASE_ADMIN_CLIENT_EMAIL
        } as unknown as ServiceAccount),
      });
      
      this.userManagementService = new FirebaseUserManagementService(
        initializeApp,
        getAuth,
        createUserWithEmailAndPassword,
        signInWithEmailAndPassword,
        signOut,
        adminApp!
      );
    }
    
    return this.userManagementService;
  }
}