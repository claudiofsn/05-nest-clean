import { Either, left, right } from '@/core/either';
import { QuestionsRepository } from '../repositories/questions-repository';
import { NotAllowedError } from './errors/not-allowed-error';
import { ResourceNotFoundError } from './errors/resource-not-found';
import { Injectable } from '@nestjs/common';

interface DeleteQuestionRequest {
  authorId: string;
  questionId: string;
}

type DeleteQuestionResponse = Either<ResourceNotFoundError | NotAllowedError, null>;

@Injectable()
export class DeleteQuestionUseCase {
  constructor(private questionsRepository: QuestionsRepository) {}

  async execute({ authorId, questionId }: DeleteQuestionRequest): Promise<DeleteQuestionResponse> {
    const question = await this.questionsRepository.findById(questionId);

    if (!question) {
      return left(new ResourceNotFoundError());
    }

    const isAuthorRequestingToDeleteQuestion = authorId === question.authorId.toString();

    if (!isAuthorRequestingToDeleteQuestion) {
      return left(new NotAllowedError());
    }

    await this.questionsRepository.delete(question);

    return right(null);
  }
}
