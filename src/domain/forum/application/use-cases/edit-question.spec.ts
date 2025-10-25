import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { makeQuestion } from 'test/factories/make-question';
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachment-repository';
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository';
import { EditQuestionUseCase } from './edit-question';
import { NotAllowedError } from './errors/not-allowed-error';
import { makeQuestionAttachment } from 'test/factories/make-question-attachments';
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository';
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository';

let sut: EditQuestionUseCase;
let questionsRepository: InMemoryQuestionsRepository;
let questionsAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let attachmentRepository: InMemoryAttachmentsRepository;
let studentRepository: InMemoryStudentsRepository;

describe('Edit Question', () => {
  beforeEach(() => {
    questionsAttachmentsRepository = new InMemoryQuestionAttachmentsRepository();
    attachmentRepository = new InMemoryAttachmentsRepository();
    studentRepository = new InMemoryStudentsRepository();
    questionsRepository = new InMemoryQuestionsRepository(
      questionsAttachmentsRepository,
      attachmentRepository,
      studentRepository,
    );
    sut = new EditQuestionUseCase(questionsRepository, questionsAttachmentsRepository);
  });

  it('should be able to edit a question', async () => {
    const newQuestion = makeQuestion(
      { authorId: new UniqueEntityID('author-1') },
      new UniqueEntityID('question-1'),
    );

    await questionsRepository.create(newQuestion);

    questionsAttachmentsRepository.items.push(
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: new UniqueEntityID('1'),
      }),
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: new UniqueEntityID('2'),
      }),
    );

    await sut.execute({
      authorId: 'author-1',
      questionId: newQuestion.id.toValue(),
      title: 'Teste 1',
      content: 'Some content',
      attachmentsIds: ['1', '3'],
    });

    expect(questionsRepository.items[0]).toMatchObject({
      title: 'Teste 1',
      content: 'Some content',
    });

    expect(questionsRepository.items[0].attachments.currentItems).toHaveLength(2);
    expect(questionsRepository.items[0].attachments.currentItems).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityID('1') }),
      expect.objectContaining({ attachmentId: new UniqueEntityID('3') }),
    ]);
  });

  it('should not be able to edit a question from another user', async () => {
    const newQuestion = makeQuestion(
      { authorId: new UniqueEntityID('author-1') },
      new UniqueEntityID('question-1'),
    );

    await questionsRepository.create(newQuestion);

    const result = await sut.execute({
      authorId: 'author-2',
      questionId: newQuestion.id.toValue(),
      title: 'Teste 1',
      content: 'Some content',
      attachmentsIds: [],
    });

    expect(result.isLeft());
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });

  it('should sync a new and removed attachs when editing a question', async () => {
    const newQuestion = makeQuestion(
      { authorId: new UniqueEntityID('author-1') },
      new UniqueEntityID('question-1'),
    );

    await questionsRepository.create(newQuestion);

    questionsAttachmentsRepository.items.push(
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: new UniqueEntityID('1'),
      }),
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: new UniqueEntityID('2'),
      }),
    );

    const result = await sut.execute({
      authorId: 'author-1',
      questionId: newQuestion.id.toValue(),
      title: 'Teste 1',
      content: 'Some content',
      attachmentsIds: ['1', '3'],
    });

    expect(result.isRight()).toBe(true);
    expect(questionsAttachmentsRepository.items).toHaveLength(2);
    expect(questionsAttachmentsRepository.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          attachmentId: new UniqueEntityID('1'),
        }),
        expect.objectContaining({
          attachmentId: new UniqueEntityID('3'),
        }),
      ]),
    );
  });
});
