import { makeQuestion } from 'test/factories/make-question';
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository';
import { QuestionsRepository } from '../repositories/questions-repository';
import { FetchRecentQuestionsUseCase } from './fetch-recent-questions';
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachment-repository';
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository';
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository';

let sut: FetchRecentQuestionsUseCase;
let questionsRepository: QuestionsRepository;
let questionsAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let attachmentsRepository: InMemoryAttachmentsRepository;
let studentsRepository: InMemoryStudentsRepository;

describe('Fetch Recent Questions', () => {
  beforeEach(() => {
    questionsAttachmentsRepository = new InMemoryQuestionAttachmentsRepository();
    attachmentsRepository = new InMemoryAttachmentsRepository();
    studentsRepository = new InMemoryStudentsRepository();
    questionsRepository = new InMemoryQuestionsRepository(
      questionsAttachmentsRepository,
      attachmentsRepository,
      studentsRepository,
    );
    sut = new FetchRecentQuestionsUseCase(questionsRepository);
  });

  it('should be able to fetch recent questions', async () => {
    await questionsRepository.create(makeQuestion({ createdAt: new Date(2022, 0, 20) }));
    await questionsRepository.create(makeQuestion({ createdAt: new Date(2022, 0, 23) }));
    await questionsRepository.create(makeQuestion({ createdAt: new Date(2022, 0, 28) }));

    const result = await sut.execute({ page: 1 });

    expect(result.isRight()).toBeTruthy();

    if (result.isRight()) {
      expect(result.value.questions).toEqual([
        expect.objectContaining({ createdAt: new Date(2022, 0, 28) }),
        expect.objectContaining({ createdAt: new Date(2022, 0, 23) }),
        expect.objectContaining({ createdAt: new Date(2022, 0, 20) }),
      ]);
    }
  });

  it('should be able to fetch paginted recent questions', async () => {
    for (let i = 1; i <= 22; i++) {
      await questionsRepository.create(makeQuestion());
    }

    const result = await sut.execute({ page: 2 });

    expect(result.isRight()).toBeTruthy();
    if (result.isRight()) {
      expect(result.value.questions).toHaveLength(2);
    }
  });
});
