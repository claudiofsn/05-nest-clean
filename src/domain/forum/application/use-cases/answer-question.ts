import { Either, right } from '@/core/either';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Answer } from '../../enterprise/entities/answer';
import { AnswerAttachment } from '../../enterprise/entities/answer-attachment';
import { AnswerAttachmentList } from '../../enterprise/entities/answer-attachment-list';
import { AnswersRepository } from '../repositories/answers-repository';
import { Injectable } from '@nestjs/common';

interface AnswerQuestionRequest {
  authorId: string;
  questionId: string;
  attachmentsIds: string[];
  content: string;
}

type AnswerQuestionResponse = Either<null, { answer: Answer }>;

@Injectable()
export class AnswerQuestionUseCase {
  constructor(private answersRepository: AnswersRepository) {}

  async execute({
    questionId,
    authorId,
    content,
    attachmentsIds,
  }: AnswerQuestionRequest): Promise<AnswerQuestionResponse> {
    const answer = Answer.create({
      content,
      authorId: new UniqueEntityID(authorId),
      questionId: new UniqueEntityID(questionId),
    });

    const answerAttachments = attachmentsIds.map((attachmentsId) => {
      return AnswerAttachment.create({
        attachmentId: new UniqueEntityID(attachmentsId),
        answerId: answer.id,
      });
    });

    answer.attachments = new AnswerAttachmentList(answerAttachments);

    await this.answersRepository.create(answer);

    return right({ answer });
  }
}
