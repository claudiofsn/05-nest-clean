import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { makeAnswerComment } from 'test/factories/make-answer-comment';
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository';
import { DeleteAnswerCommentUseCase } from './delete-answer-comment';
import { NotAllowedError } from './errors/not-allowed-error';
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository';

let sut: DeleteAnswerCommentUseCase;
let answerCommentsRepository: InMemoryAnswerCommentsRepository;
let studentRepository: InMemoryStudentsRepository;

describe('Delete Answer Comment', () => {
  beforeEach(() => {
    studentRepository = new InMemoryStudentsRepository();
    answerCommentsRepository = new InMemoryAnswerCommentsRepository(studentRepository);
    sut = new DeleteAnswerCommentUseCase(answerCommentsRepository);
  });

  it('should be able to delete a answer comment', async () => {
    const answerComment = makeAnswerComment();

    await answerCommentsRepository.create(answerComment);

    await sut.execute({
      authorId: answerComment.authorId.toString(),
      answerCommentId: answerComment.id.toString(),
    });

    expect(answerCommentsRepository.items).toHaveLength(0);
  });

  it('should not be able to delete another user answer comment', async () => {
    const answerComment = makeAnswerComment({
      authorId: new UniqueEntityID('author-1'),
    });

    await answerCommentsRepository.create(answerComment);

    const result = await sut.execute({
      answerCommentId: answerComment.id.toString(),
      authorId: 'author-2',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
