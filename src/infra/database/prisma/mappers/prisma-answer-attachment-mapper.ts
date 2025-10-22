import { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment';
import { Prisma, Attachment as PrismaAttachment } from '../../../../../generated/prisma';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

export class PrismaAnswerAttachmentMapper {
  static toDomain(raw: PrismaAttachment): AnswerAttachment {
    if (!raw.answerId) {
      throw new Error('Invalid attachment type.');
    }

    return AnswerAttachment.create(
      {
        answerId: new UniqueEntityID(raw.answerId),
        attachmentId: new UniqueEntityID(raw.id),
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrismaUpdateMany(answerAttachment: AnswerAttachment[]): Prisma.AttachmentUpdateManyArgs {
    const attachmentsIds = answerAttachment.map((attachment) => attachment.attachmentId.toString());

    return {
      where: {
        id: {
          in: attachmentsIds,
        },
      },
      data: {
        answerId: answerAttachment[0].answerId.toString(),
      },
    };
  }
}
