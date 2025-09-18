import { UniqueEntityID } from '@/core/entities/unique-entity-id';
// eslint-disable-next-line prettier/prettier
import { QuestionComment, QuestionCommentProps } from "@/domain/forum/enterprise/entities/question-comments";
import { faker } from '@faker-js/faker';

export function makeQuestionComment(
  override: Partial<QuestionCommentProps> = {},
  id?: UniqueEntityID,
) {
  return QuestionComment.create(
    {
      authorId: new UniqueEntityID(),
      questionId: new UniqueEntityID(),
      content: faker.lorem.text(),
      ...override,
    },
    id,
  );
}
