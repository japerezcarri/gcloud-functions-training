export interface TrainingMessage{
    messageId: number,
    messageTitle: string,
    messageContent: string,
    createdAt: Date,
    toUserId: number,
    fromUserId: number
}