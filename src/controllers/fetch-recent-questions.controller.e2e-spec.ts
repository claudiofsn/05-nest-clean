import { AppModule } from "@/app.module";
import { PrismaService } from "@/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import { hash } from "bcryptjs";
import request from "supertest";

describe('Fetch Recent Questions (e2e)', () => {
    let app: INestApplication;
    let prisma: PrismaService;
    let jwt: JwtService

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule],
        })
            .compile();

        app = moduleRef.createNestApplication();

        prisma = moduleRef.get<PrismaService>(PrismaService);
        jwt = moduleRef.get<JwtService>(JwtService);

        await app.init();
    });


    test('[GET] /questions', async () => {
        const user = await prisma.user.create({
            data: {
                name: 'Test User',
                email: 'test@gmail.com',
                password: await hash('password', 8),
            }
        })

        const accessToken = jwt.sign({ sub: user.id });

        await prisma.question.createMany({
            data: [
                {
                    title: 'Question 1',
                    content: 'Content 1',
                    slug: 'question-1',
                    authorId: user.id
                },
                {
                    title: 'Question 2',
                    content: 'Content 2',
                    slug: 'question-2',
                    authorId: user.id
                },
            ]
        })

        const response = await request(app.getHttpServer())
            .get('/questions')
            .set('Authorization', `Bearer ${accessToken}`)

        expect(response.statusCode).toBe(200)
        expect(response.body).toEqual({
            questions: [
                expect.objectContaining({ title: 'Question 1' }),
                expect.objectContaining({ title: 'Question 2' }),

            ]
        })
    });
})