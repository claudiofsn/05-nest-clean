import { UniqueEntityID } from '@/core/entities/unique-entity-id';
// eslint-disable-next-line prettier/prettier
import { AnswerComment, AnswerCommentProps } from "@/domain/forum/enterprise/entities/answer-comments";
import { PrismaAnswerCommentMapper } from '@/infra/database/prisma/mappers/prisma-answer-comment-mapper';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';

export function makeAnswerComment(override: Partial<AnswerCommentProps> = {}, id?: UniqueEntityID) {
  return AnswerComment.create(
    {
      authorId: new UniqueEntityID(),
      answerId: new UniqueEntityID(),
      content: faker.lorem.text(),
      ...override,
    },
    id,
  );
}

@Injectable()
export class AnswerCommentFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaQuestion(data: Partial<AnswerCommentProps> = {}): Promise<AnswerComment> {
    const answerComment = makeAnswerComment(data);

    await this.prisma.comment.create({
      data: PrismaAnswerCommentMapper.toPrisma(answerComment),
    });

    return answerComment;
  }
}
