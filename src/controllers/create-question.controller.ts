import {
    Body,
    Controller,
    HttpCode,
    Post,
    Req,
    UseGuards,
} from '@nestjs/common'
import { PrismaService } from '@/prisma/prisma.service'
import { JwtService } from '@nestjs/jwt'
import { JwtAuthGuard } from '@/auth/jwt-auth.guard'
import { Request } from 'express'
import { CurrentUser } from '@/auth/current-user-decorator'
import { UserPayload } from '@/auth/jwt.strategy'
import z from 'zod'
import { ZodValidationPipe } from '@/pipes/zod-validation.pipe'

const createQuestionBodySchema = z.object({
    title: z.string(),
    content: z.string()
})

const bodyValidationPipe = new ZodValidationPipe(createQuestionBodySchema)

type CreateQuestionBodySchema = z.infer<typeof createQuestionBodySchema>

@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class CreateQuestionController {
    constructor(private prisma: PrismaService) { }

    @Post()
    @HttpCode(201)
    async handle(
        @Body(bodyValidationPipe) body: CreateQuestionBodySchema,
        @CurrentUser() user: UserPayload
    ) {
        const { title, content } = body

        const userId = user.sub

        await this.prisma.question.create({
            data: {
                title,
                content,
                authorId: userId,
                slug: this.convertToSlug(title)
            }
        })
    }

    private convertToSlug(title: string): string {
        return title
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
    }
}