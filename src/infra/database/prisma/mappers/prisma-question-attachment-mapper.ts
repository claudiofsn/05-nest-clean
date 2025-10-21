import { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment';
import { Prisma, Attachment as PrismaAttachment } from '../../../../../generated/prisma';
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

  static toPrismaUpdateMany(
    questionAttachment: QuestionAttachment[],
  ): Prisma.AttachmentUpdateManyArgs {
    const attachmentsIds = questionAttachment.map((attachment) =>
      attachment.attachmentId.toString(),
    );

    return {
      where: {
        id: {
          in: attachmentsIds,
        },
      },
      data: {
        questionId: questionAttachment[0].questionId.toString(),
      },
    };
  }
}
