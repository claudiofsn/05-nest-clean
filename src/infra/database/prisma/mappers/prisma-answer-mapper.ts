import { Answer } from '@/domain/forum/enterprise/entities/answer';
import { Answer as PrismaAnswer, Prisma } from '../../../../../generated/prisma';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

export class PrismaAnswerMapper {
  static toDomain(raw: PrismaAnswer) {
    return Answer.create(
      {
        content: raw.content,
        authorId: new UniqueEntityID(raw.authorId),
        questionId: new UniqueEntityID(raw.questionId),
        createdAt: raw.createdAt,
        updatedAt: raw.updated,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(question: Answer): Prisma.AnswerUncheckedCreateInput {
    return {
      id: question.id.toString(),
      authorId: question.authorId.toString(),
      content: question.content,
      questionId: question.questionId.toString(),
      createdAt: question.createdAt,
      updated: question.updatedAt,
    };
  }
}
