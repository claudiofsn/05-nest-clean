import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { makeQuestionComment } from 'test/factories/make-question-comment';
import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository';
import { DeleteQuestionCommentUseCase } from './delete-question-comment';
import { NotAllowedError } from './errors/not-allowed-error';
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository';

let sut: DeleteQuestionCommentUseCase;
let questionCommentsRepository: InMemoryQuestionCommentsRepository;
let studentRepository = new InMemoryStudentsRepository();

describe('Delete Question Comment', () => {
  beforeEach(() => {
    studentRepository = new InMemoryStudentsRepository();
    questionCommentsRepository = new InMemoryQuestionCommentsRepository(studentRepository);
    sut = new DeleteQuestionCommentUseCase(questionCommentsRepository);
  });

  it('should be able to delete a question comment', async () => {
    const questionComment = makeQuestionComment();

    await questionCommentsRepository.create(questionComment);

    await sut.execute({
      authorId: questionComment.authorId.toString(),
      questionCommentId: questionComment.id.toString(),
    });

    expect(questionCommentsRepository.items).toHaveLength(0);
  });

  it('should not be able to delete another user question comment', async () => {
    const questionComment = makeQuestionComment({}, new UniqueEntityID('author-1'));
    await questionCommentsRepository.create(questionComment);

    const result = await sut.execute({
      authorId: 'author-2',
      questionCommentId: questionComment.id.toString(),
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
