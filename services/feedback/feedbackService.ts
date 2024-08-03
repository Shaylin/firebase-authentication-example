export default interface FeedbackService {
  sendFeedback(good: boolean): Promise<boolean>;
}