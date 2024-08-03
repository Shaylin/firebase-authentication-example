import ValidationService from "@/services/validation/validationService";
import NodeValidationService from "@/services/validation/nodeValidationService";
import validator, { StrongPasswordOptions } from "validator";
import UserManagementService from "@/services/userManagement/userManagementService";
import FirebaseUserManagementService from "@/services/userManagement/firebaseUserManagementService";
import { initializeApp } from "@firebase/app";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, getAuth } from "firebase/auth";
import admin, { ServiceAccount } from "firebase-admin";
import firebaseServiceAccount from "../firebaseServiceAccount.json";

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
        credential: admin.credential.cert(firebaseServiceAccount as unknown as ServiceAccount),
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