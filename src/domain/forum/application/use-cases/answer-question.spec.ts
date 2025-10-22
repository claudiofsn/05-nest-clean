import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository';
import { AnswerQuestionUseCase } from './answer-question';
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

let sut: AnswerQuestionUseCase;
let answersRepository: InMemoryAnswersRepository;
let answerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;

describe('Answer question', () => {
  beforeEach(() => {
    answerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository();
    answersRepository = new InMemoryAnswersRepository(answerAttachmentsRepository);
    sut = new AnswerQuestionUseCase(answersRepository);
  });

  it('should be able to create an answer', async () => {
    const result = await sut.execute({
      authorId: '1',
      questionId: '2',
      content: 'TESTE RESPOSTA',
      attachmentsIds: ['1', '2'],
    });

    expect(result.isRight()).toBeTruthy();
    expect(answersRepository.items[0]).toEqual(result.value?.answer);
  });

  it('should persist attachments when create a new answer', async () => {
    const result = await sut.execute({
      authorId: 'author-1',
      content: 'contenttttt',
      questionId: 'question-1',
      attachmentsIds: ['1', '2'],
    });

    expect(result.isRight()).toBeTruthy();
    expect(answerAttachmentsRepository.items).toHaveLength(2);
    expect(answerAttachmentsRepository.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          attachmentId: new UniqueEntityID('1'),
        }),
        expect.objectContaining({
          attachmentId: new UniqueEntityID('2'),
        }),
      ]),
    );
  });
});
