import { BadRequestException, Controller, Get, HttpCode, Param } from '@nestjs/common';
import { GetQuestionBySlugUseCase } from '@/domain/forum/application/use-cases/get-question-by-slug';
import { QuestionPresenter } from '../presenters/question-presenter';

@Controller('/questions/:slug')
export class GetQuestionBySlugController {
  constructor(private fetchRecentQuestions: GetQuestionBySlugUseCase) {}

  @Get()
  @HttpCode(200)
  async handle(@Param('slug') slug: string) {
    const result = await this.fetchRecentQuestions.execute({ slug });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    return { question: QuestionPresenter.toHTTP(result.value.question) };
  }
}
