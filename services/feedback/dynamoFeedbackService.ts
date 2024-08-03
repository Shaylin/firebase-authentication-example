import FeedbackService from "@/services/feedback/feedbackService";
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { randomUUID } from "crypto";

export default class DynamoFeedbackService implements FeedbackService {
  private readonly client: DynamoDBClient;
  
  constructor() {
    this.client = new DynamoDBClient(
      {
        region: process.env.AWS_REGION,
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
        }
      }
    );
  }
  
  async sendFeedback(good: boolean): Promise<boolean> {
    const putItemCommand = new PutItemCommand({
      TableName: process.env.DYNAMO_FEEDBACK_TABLE_NAME!,
      Item: {
        id: { S: randomUUID() },
        feedback: { S: good ? "good" : "bad" }
      }
    });
    
    try {
      await this.client.send(putItemCommand);
    } catch (exception) {
      console.error(exception);
      return false;
    }
    return true;
  }
}