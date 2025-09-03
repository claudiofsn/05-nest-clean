import { UniqueEntityID } from '@/core/entities/unique-entity-id'
// eslint-disable-next-line prettier/prettier
import { AnswerComment, AnswerCommentProps } from "@/domain/forum/enterprise/entities/answer-comments";
import { faker } from '@faker-js/faker'

export function makeAnswerComment(
  override: Partial<AnswerCommentProps> = {},
  id?: UniqueEntityID,
) {
  return AnswerComment.create(
    {
      authorId: new UniqueEntityID(),
      answerId: new UniqueEntityID(),
      content: faker.lorem.text(),
      ...override,
    },
    id,
  )
}
