import FirebaseUserManagementService from "@/services/userManagement/firebaseUserManagementService";
import { MockProxy, mock } from "jest-mock-extended";
import { FirebaseApp } from "firebase/app";
import { Auth } from "firebase/auth";

describe("Firebase User Management Service", () => {
  let service: FirebaseUserManagementService;
  let mockInitializeApp = jest.fn();
  let mockGetAuth = jest.fn();
  let mockCreateUserWithEmailAndPassword = jest.fn();
  let mockSignInWithEmailAndPassword = jest.fn();
  let mockSignOut = jest.fn();
  let mockFirebaseApp: MockProxy<FirebaseApp>;
  let mockFirebaseAuth: MockProxy<Auth>;
  
  beforeEach(() => {
    process.env.FIREBASE_API_KEY = "fake-key";
    process.env.FIREBASE_AUTH_DOMAIN = "fake.auth.domain";
    process.env.FIREBASE_PROJECT_ID = "111";
    process.env.FIREBASE_STORAGE_BUCKET = "fake.storage.bucket";
    process.env.FIREBASE_MESSAGING_SENDER_ID = "222";
    process.env.FIREBASE_APP_ID = "333"
    process.env.FIREBASE_MEASUREMENT_ID = "444";
    
    mockFirebaseApp = mock<FirebaseApp>();
    mockFirebaseAuth = mock<Auth>();
    
    mockInitializeApp.mockReturnValue(mockFirebaseApp);
    mockGetAuth.mockReturnValue(mockFirebaseAuth);
    
    service = new FirebaseUserManagementService(
      mockInitializeApp,
      mockGetAuth,
      mockCreateUserWithEmailAndPassword,
      mockSignInWithEmailAndPassword,
      mockSignOut
    );
  });
  
  describe("Constructor", () => {
    it("Should construct", () => {
      expect(service).toBeInstanceOf(FirebaseUserManagementService);
    });
    
    it("Should get an authentication instance using the created firebase app", () => {
      expect(mockInitializeApp).toHaveBeenCalledWith({
        apiKey: "fake-key",
        authDomain: "fake.auth.domain",
        projectId: "111",
        storageBucket: "fake.storage.bucket",
        messagingSenderId: "222",
        appId: "333",
        measurementId: "444"
      });
      
      expect(mockGetAuth).toHaveBeenCalledWith(mockFirebaseApp);
    });
  });
  
  describe("createUser", () => {
    it("Should create the user with the given delegate and return the user id token", async () => {
      mockCreateUserWithEmailAndPassword.mockResolvedValue({ user: { getIdToken: async () => "some-id-token" } });
      
      const returnedToken = await service.createUser("bugcat@capoo.com", "Password1234$");
      
      expect(mockCreateUserWithEmailAndPassword).toHaveBeenCalledWith(mockFirebaseAuth, "bugcat@capoo.com", "Password1234$");
      
      expect(returnedToken).toBe("some-id-token");
    });
  });
  
  describe("login", () => {
    it("Should sign in the user with the given delegate and return the user id token", async () => {
      mockSignInWithEmailAndPassword.mockResolvedValue({ user: { getIdToken: async () => "another-id-token" } });
      
      const returnedToken = await service.login("bugcatz@capoo.com", "Password1234$");
      
      expect(mockSignInWithEmailAndPassword).toHaveBeenCalledWith(mockFirebaseAuth, "bugcatz@capoo.com", "Password1234$");
      
      expect(returnedToken).toBe("another-id-token");
    });
  });
  
  describe("logout", () => {
    it("Should sign out the user with the given delegate", async () => {
      mockSignOut.mockResolvedValue(null);
      
      await service.logout();
      
      expect(mockSignOut).toHaveBeenCalled();
    });
  });
});
