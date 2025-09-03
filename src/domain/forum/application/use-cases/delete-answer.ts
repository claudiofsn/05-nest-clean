import { Either, left, right } from '@/core/either'
import { AnswersRepository } from '../repositories/answers-repository'
import { NotAllowedError } from './errors/not-allowed-error'
import { ResourceNotFoundError } from './errors/resource-not-found'

interface DeleteAnswersRequest {
  authorId: string
  answersId: string
}

type DeleteAnswersResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  object
>

export class DeleteAnswersUseCase {
  constructor(private answersRepository: AnswersRepository) {}

  async execute({
    authorId,
    answersId,
  }: DeleteAnswersRequest): Promise<DeleteAnswersResponse> {
    const answer = await this.answersRepository.findById(answersId)

    if (!answer) {
      return left(new ResourceNotFoundError())
    }

    const isAuthorRequestingToDeleteAnswers =
      authorId === answer.authorId.toString()

    if (!isAuthorRequestingToDeleteAnswers) {
      return left(new NotAllowedError())
    }

    await this.answersRepository.delete(answer)

    return right({})
  }
}
