import DynamoFeedbackService from "@/services/feedback/dynamoFeedbackService";
import "aws-sdk-client-mock-jest";
import { AwsClientStub, mockClient } from "aws-sdk-client-mock";
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";

describe("DynamoFeedbackService", () => {
  let service: DynamoFeedbackService;
  let mockDynamoClient: AwsClientStub<DynamoDBClient>;
  
  beforeEach(() => {
    process.env.DYNAMO_FEEDBACK_TABLE_NAME = "fake-table";
    service = new DynamoFeedbackService();
    mockDynamoClient = mockClient(DynamoDBClient);
  });
  
  describe("Constructor", () => {
    it("Should construct", () => {
      expect(service).toBeInstanceOf(DynamoFeedbackService);
    });
  });
  
  describe("sendFeedback", () => {
    describe("When the dynamo db write operation succeeds", () => {
      it("Should return a promise that resolves to true", async () => {
        expect(mockDynamoClient).not.toHaveReceivedCommand(PutItemCommand);
        
        const result = await service.sendFeedback(false);
        
        expect(mockDynamoClient).toHaveReceivedCommandWith(PutItemCommand, {
          TableName: "fake-table",
          Item: {
            id: { S: expect.any(String) },
            feedback: { S: "bad" }
          }
        });
        
        expect(result).toBe(true);
      });
    });
    
    describe("When the dynamo db write operation fails", () => {
      it("Should return a promise that resolves to false", async () => {
        mockDynamoClient.send.throws("test error, don't be alarmed");
        
        expect(mockDynamoClient).not.toHaveReceivedCommand(PutItemCommand);
        
        const result = await service.sendFeedback(true);
        
        
        expect(mockDynamoClient).toHaveReceivedCommandWith(PutItemCommand, {
          TableName: "fake-table",
          Item: {
            id: { S: expect.any(String) },
            feedback: { S: "good" }
          }
        });
        
        expect(result).toBe(false);
      });
    });
  });
})