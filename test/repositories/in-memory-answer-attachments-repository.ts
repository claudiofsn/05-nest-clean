import { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachments-repository';
import { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment';

export class InMemoryAnswerAttachmentsRepository implements AnswerAttachmentsRepository {
  public items: AnswerAttachment[] = [];

  async createMany(attachments: AnswerAttachment[]): Promise<void> {
    console.debug(attachments);
    this.items.push(...attachments);
  }

  async deleteMany(attachments: AnswerAttachment[]): Promise<void> {
    this.items = this.items.filter((item) => !attachments.some((att) => att.equals(item)));
  }

  async findManyByAnswerId(answerId: string): Promise<AnswerAttachment[]> {
    return this.items.filter((item) => item.answerId.toString() === answerId);
  }

  async deleteManyByAnswerId(answerId: string): Promise<void> {
    const answerAttachments = this.items.filter((item) => item.answerId.toString() !== answerId);

    this.items = answerAttachments;
  }
}
