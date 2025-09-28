import { Either, left, right } from '@/core/either';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Question } from '../../enterprise/entities/question';
import { QuestionAttachment } from '../../enterprise/entities/question-attachment';
import { QuestionAttachmentList } from '../../enterprise/entities/question-attachment-list';
import { QuestionAttachmentsRepository } from '../repositories/question-attachments-repository';
import { QuestionsRepository } from '../repositories/questions-repository';
import { NotAllowedError } from './errors/not-allowed-error';
import { ResourceNotFoundError } from './errors/resource-not-found';
import { Injectable } from '@nestjs/common';

interface EditQuestionRequest {
  questionId: string;
  authorId: string;
  title: string;
  content: string;
  attachmentsIds: string[];
}

type EditQuestionResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    question: Question;
  }
>;

@Injectable()
export class EditQuestionUseCase {
  constructor(
    private questionsRepository: QuestionsRepository,
    private questionAttachmentsRepository: QuestionAttachmentsRepository,
  ) {}

  async execute({
    authorId,
    questionId,
    title,
    content,
    attachmentsIds,
  }: EditQuestionRequest): Promise<EditQuestionResponse> {
    const question = await this.questionsRepository.findById(questionId);

    if (!question) {
      return left(new ResourceNotFoundError());
    }

    const isAuthorRequestingToEditQuestion = authorId === question.authorId.toString();

    if (!isAuthorRequestingToEditQuestion) {
      return left(new NotAllowedError());
    }

    const currentQuestionAttachments =
      await this.questionAttachmentsRepository.findManyByQuestionId(questionId);

    const questionAttachmentList = new QuestionAttachmentList(currentQuestionAttachments);

    const questionAttachments = attachmentsIds.map((attachmentsId) => {
      return QuestionAttachment.create({
        attachmentId: new UniqueEntityID(attachmentsId),
        questionId: question.id,
      });
    });

    questionAttachmentList.update(questionAttachments);

    question.title = title;
    question.content = content;
    question.attachments = questionAttachmentList;

    await this.questionsRepository.save(question);

    return right({
      question,
    });
  }
}
