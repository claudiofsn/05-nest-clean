import { makeAnswer } from 'test/factories/make-answer';
import { makeQuestion } from 'test/factories/make-question';
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository';
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachment-repository';
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository';
import { AnswersRepository } from '../repositories/answers-repository';
import { ChooseQuestionBestAnswerUseCase } from './choose-question-best-answer';
import { NotAllowedError } from './errors/not-allowed-error';
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository';
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository';
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository';

let sut: ChooseQuestionBestAnswerUseCase;
let questionsRepository: InMemoryQuestionsRepository;
let answersRepository: AnswersRepository;
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let answerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
let attachmentRepository: InMemoryAttachmentsRepository;
let studentsRepository: InMemoryStudentsRepository;

describe('Choose Question Best Answer', () => {
  beforeEach(() => {
    answerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository();
    answersRepository = new InMemoryAnswersRepository(answerAttachmentsRepository);
    inMemoryQuestionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository();
    attachmentRepository = new InMemoryAttachmentsRepository();
    studentsRepository = new InMemoryStudentsRepository();
    questionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
      attachmentRepository,
      studentsRepository,
    );
    sut = new ChooseQuestionBestAnswerUseCase(questionsRepository, answersRepository);
  });

  it('should be able to choose to a question a best answer', async () => {
    const question = makeQuestion();
    const answer = makeAnswer({
      questionId: question.id,
    });

    await questionsRepository.create(question);
    await answersRepository.create(answer);

    const result = await sut.execute({
      answerId: answer.id.toString(),
      authorId: question.authorId.toString(),
    });

    expect(result.isRight()).toBeTruthy();
    expect(questionsRepository.items[0].bestAnswerId).toEqual(answer.id);
  });

  it('should not be able to choose another user question best answer', async () => {
    const question = makeQuestion();
    const answer = makeAnswer({
      questionId: question.id,
    });

    await questionsRepository.create(question);
    await answersRepository.create(answer);

    const result = await sut.execute({
      answerId: answer.id.toValue(),
      authorId: 'author-2',
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
