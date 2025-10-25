import { PaginationParams } from '@/core/repositories/pagination-params';
import { QuestionCommentsRepository } from '@/domain/forum/application/repositories/question-comments-repository';
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comments';
import { InMemoryStudentsRepository } from './in-memory-students-repository';
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-author';

export class InMemoryQuestionCommentsRepository implements QuestionCommentsRepository {
  public items: QuestionComment[] = [];

  constructor(private studentsRepository: InMemoryStudentsRepository) {}

  async create(questionComment: QuestionComment) {
    this.items.push(questionComment);
  }

  async findById(id: string): Promise<QuestionComment | null> {
    const questionComment = this.items.find((item) => item.id.toString() === id);

    if (!questionComment) {
      return null;
    }

    return questionComment;
  }

  async delete(questionComment: QuestionComment): Promise<void> {
    const questionCommentIndex = this.items.findIndex((item) => item.id === questionComment.id);

    this.items.splice(questionCommentIndex, 1);
  }

  async findManyByQuestionId(
    questionId: string,
    { page }: PaginationParams,
  ): Promise<QuestionComment[]> {
    const questionComments = this.items
      .filter((answer) => answer.questionId.toString() === questionId)
      .slice((page - 1) * 20, page * 20);

    return questionComments;
  }

  async findManyByQuestionIdWithAuthor({
    questionId,
    params,
  }: {
    questionId: string;
    params: PaginationParams;
  }): Promise<CommentWithAuthor[]> {
    const questionComments = this.items
      .filter((item) => item.questionId.toString() === questionId)
      .slice((params.page - 1) * 20, params.page * 20)
      .map((comment) => {
        const author = this.studentsRepository.items.find((student) => {
          return student.id.equals(comment.authorId);
        });

        if (!author) {
          throw new Error(`Author with ID "${comment.authorId.toString()} does not exist."`);
        }

        return CommentWithAuthor.create({
          commentId: comment.id,
          content: comment.content,
          createdAt: comment.createdAt,
          updatedAt: comment.updatedAt,
          authorId: comment.authorId,
          author: author.name,
        });
      });

    return questionComments;
  }
}
