import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository';
import { CreateQuestionUseCase } from './create-question';
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachment-repository';
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository';
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository';

let sut: CreateQuestionUseCase;
let questionsRepository: InMemoryQuestionsRepository;
let questionsAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let attachmentRepository: InMemoryAttachmentsRepository;
let studentRepository: InMemoryStudentsRepository;

describe('Create Question', () => {
  beforeEach(() => {
    questionsAttachmentsRepository = new InMemoryQuestionAttachmentsRepository();
    attachmentRepository = new InMemoryAttachmentsRepository();
    studentRepository = new InMemoryStudentsRepository();
    questionsRepository = new InMemoryQuestionsRepository(
      questionsAttachmentsRepository,
      attachmentRepository,
      studentRepository,
    );
    sut = new CreateQuestionUseCase(questionsRepository);
  });

  it('should be able to create a question', async () => {
    const result = await sut.execute({
      authorId: 'author-1',
      title: 'title 1',
      content: 'contenttttt',
      attachmentsIds: ['1', '2'],
    });

    expect(result.isRight()).toBeTruthy();
    expect(questionsRepository.items[0]).toEqual(result.value?.question);
    expect(questionsRepository.items[0].attachments.currentItems).toHaveLength(2);
    expect(questionsRepository.items[0].attachments.currentItems).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityID('1') }),
      expect.objectContaining({ attachmentId: new UniqueEntityID('2') }),
    ]);
  });

  it('should persist attachments when create a new question', async () => {
    const result = await sut.execute({
      authorId: 'author-1',
      title: 'title 1',
      content: 'contenttttt',
      attachmentsIds: ['1', '2'],
    });

    expect(result.isRight()).toBeTruthy();
    expect(questionsAttachmentsRepository.items).toHaveLength(2);
    expect(questionsAttachmentsRepository.items).toEqual(
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
