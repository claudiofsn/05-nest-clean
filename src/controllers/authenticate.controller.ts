import {
    Body,
    ConflictException,
    Controller,
    HttpCode,
    Post,
    UnauthorizedException,
    UsePipes,
} from '@nestjs/common'
import { PrismaService } from '@/prisma/prisma.service'
import { hash } from 'bcryptjs'
import { z } from 'zod'
import { ZodValidationPipe } from '@/pipes/zod-validation.pipe'
import { JwtService } from '@nestjs/jwt'

const authenticateBodySchema = z.object({
    email: z.email(),
    password: z.string()
})

type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>

@Controller('/sessions')
export class AuthenticateController {
    constructor(private jwt: JwtService, private prisma: PrismaService) { }

    @Post()
    @HttpCode(200)
    @UsePipes(new ZodValidationPipe(authenticateBodySchema))
    async handle(@Body() body: AuthenticateBodySchema) {
        const { email, password } = body

        const user = await this.prisma.user.findUnique({
            where: {
                email,
            },
        })

        if (!user) {
            throw new UnauthorizedException('Invalid credentials')
        }

        const passwordMatch = await hash(password, user.password)

        if (!passwordMatch) {
            throw new UnauthorizedException('Invalid credentials')
        }

        const token = this.jwt.sign({
            sub: user.id,
        })

        return { token }
    }
}