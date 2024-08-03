import UserManagementService from "@/services/userManagement/userManagementService";
import { FirebaseApp } from "firebase/app";
import { FirebaseOptions } from "@firebase/app-types";
import { Auth, UserCredential } from "firebase/auth";

export default class FirebaseUserManagementService implements UserManagementService {
  private readonly firebaseApp: FirebaseApp;
  private readonly firebaseAuth: Auth;
  private readonly createUserWithEmailAndPasswordDelegate: (auth: Auth, email: string, password: string) => Promise<UserCredential>;
  private readonly signInWithEmailAndPasswordDelegate: (auth: Auth, email: string, password: string) => Promise<UserCredential>;
  private readonly signOutDelegate: (auth: Auth) => Promise<void>;
  
  constructor(
    initializeAppDelegate: (appConfig: FirebaseOptions) => FirebaseApp,
    getAuthDelegate: (app: FirebaseApp) => Auth,
    createUserWithEmailAndPasswordDelegate: (auth: Auth, email: string, password: string) => Promise<UserCredential>,
    signInWithEmailAndPasswordDelegate: (auth: Auth, email: string, password: string) => Promise<UserCredential>,
    signOutDelegate: (auth: Auth) => Promise<void>
  ) {
    this.firebaseApp = initializeAppDelegate({
      apiKey: process.env.FIREBASE_API_KEY!,
      authDomain: process.env.FIREBASE_AUTH_DOMAIN!,
      projectId: process.env.FIREBASE_PROJECT_ID!,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET!,
      messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID!,
      appId: process.env.FIREBASE_APP_ID!,
      measurementId: process.env.FIREBASE_MEASUREMENT_ID!,
    });
    
    this.firebaseAuth = getAuthDelegate(this.firebaseApp);
    
    this.createUserWithEmailAndPasswordDelegate = createUserWithEmailAndPasswordDelegate;
    this.signInWithEmailAndPasswordDelegate = signInWithEmailAndPasswordDelegate;
    this.signOutDelegate = signOutDelegate;
  }
  
  async createUser(email: string, password: string): Promise<string> {
    const userCredentials = await this.createUserWithEmailAndPasswordDelegate(this.firebaseAuth, email, password);
    
    return await userCredentials.user.getIdToken();
  }
  
  async login(email: string, password: string): Promise<string> {
    const userCredentials = await this.signInWithEmailAndPasswordDelegate(this.firebaseAuth, email, password);
    
    return await userCredentials.user.getIdToken();
  }
  
  async logout(): Promise<void> {
    await this.signOutDelegate(this.firebaseAuth);
  }
}