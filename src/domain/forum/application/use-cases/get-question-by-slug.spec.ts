import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug';
import { makeQuestion } from 'test/factories/make-question';
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository';
import { GetQuestionBySlugUseCase } from './get-question-by-slug';
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachment-repository';
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository';
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository';
import { makeStudent } from 'test/factories/make-student';
import { makeAttachment } from 'test/factories/make-attachment';
import { makeQuestionAttachment } from 'test/factories/make-question-attachments';

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let questionsAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let attachmentsRepository: InMemoryAttachmentsRepository;
let studentsRepository: InMemoryStudentsRepository;
let sut: GetQuestionBySlugUseCase;

describe('Get Question By Slug', () => {
  beforeEach(() => {
    questionsAttachmentsRepository = new InMemoryQuestionAttachmentsRepository();
    attachmentsRepository = new InMemoryAttachmentsRepository();
    studentsRepository = new InMemoryStudentsRepository();
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      questionsAttachmentsRepository,
      attachmentsRepository,
      studentsRepository,
    );
    sut = new GetQuestionBySlugUseCase(inMemoryQuestionsRepository);
  });

  it('should be able to get a question by slug', async () => {
    const student = await makeStudent({ name: 'John Doe' });

    await studentsRepository.create(student);

    const newQuestion = makeQuestion({
      authorId: student.id,
      slug: Slug.create('example-question'),
    });

    await inMemoryQuestionsRepository.create(newQuestion);

    const attachment = makeAttachment({ title: 'attachment1.png' });

    attachmentsRepository.items.push(attachment);

    questionsAttachmentsRepository.items.push(
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: attachment.id,
      }),
    );

    const result = await sut.execute({
      slug: 'example-question',
    });

    expect(result.value).toMatchObject({
      question: expect.objectContaining({
        title: newQuestion.title,
        author: 'John Doe',
        attachments: [expect.objectContaining({ title: 'attachment1.png' })],
      }),
    });
  });
});
