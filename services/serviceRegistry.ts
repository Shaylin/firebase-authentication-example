import FeedbackService from "@/services/feedback/feedbackService";
import DynamoFeedbackService from "@/services/feedback/dynamoFeedbackService";
import ValidationService from "@/services/validation/validationService";
import NodeValidationService from "@/services/validation/nodeValidationService";
import validator, { StrongPasswordOptions } from "validator";
import UserManagementService from "@/services/userManagement/userManagementService";
import FirebaseUserManagementService from "@/services/userManagement/firebaseUserManagementService";
import { initializeApp } from "@firebase/app";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, getAuth } from "firebase/auth";

export default class ServiceRegistry {
  private static feedbackService: FeedbackService;
  private static validationService: ValidationService;
  private static userManagementService: UserManagementService;
  
  public static getFeedbackService(): FeedbackService {
    if (this.feedbackService == null) {
      this.feedbackService = new DynamoFeedbackService();
    }
    
    return this.feedbackService;
  }
  
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
      this.userManagementService = new FirebaseUserManagementService(
        initializeApp,
        getAuth,
        createUserWithEmailAndPassword,
        signInWithEmailAndPassword,
        signOut
      );
    }
    
    return this.userManagementService;
  }
}