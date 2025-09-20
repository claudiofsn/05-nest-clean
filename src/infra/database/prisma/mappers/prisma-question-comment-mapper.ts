import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comments';
import { Comment as PrismaComment, Prisma } from '../../../../../generated/prisma';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

export class PrismaQuestionCommentMapper {
  static toDomain(raw: PrismaComment): QuestionComment {
    if (!raw.questionId) {
      throw new Error('Invalid comment type.');
    }

    return QuestionComment.create(
      {
        content: raw.content,
        authorId: new UniqueEntityID(raw.authorId),
        questionId: new UniqueEntityID(raw.questionId),
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(answerComment: QuestionComment): Prisma.CommentUncheckedCreateInput {
    return {
      id: answerComment.id.toString(),
      authorId: answerComment.authorId.toString(),
      questionId: answerComment.questionId.toString(),
      content: answerComment.content,
      createdAt: answerComment.createdAt,
      updatedAt: answerComment.updatedAt,
    };
  }
}
