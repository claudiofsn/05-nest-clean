import {
    Controller,
    HttpCode,
    Post,
    UseGuards,
} from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'

import { JwtService } from '@nestjs/jwt'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'


@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class CreateQuestionController {
    constructor(private jwt: JwtService, private prisma: PrismaService) { }

    @Post()
    @HttpCode(200)
    async handle() {
        return 'ok'
    }
}