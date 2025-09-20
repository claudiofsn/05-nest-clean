import { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment';
import { Attachment as PrismaAttachment } from '../../../../../generated/prisma';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

export class PrismaQuestionAttachmentMapper {
  static toDomain(raw: PrismaAttachment): QuestionAttachment {
    if (!raw.questionId) {
      throw new Error('Invalid attachment type.');
    }

    return QuestionAttachment.create(
      {
        questionId: new UniqueEntityID(raw.questionId),
        attachmentId: new UniqueEntityID(raw.id),
      },
      new UniqueEntityID(raw.id),
    );
  }
}
