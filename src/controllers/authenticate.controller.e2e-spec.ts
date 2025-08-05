import { AppModule } from "@/app.module";
import { PrismaService } from "@/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { hash } from "bcryptjs";
import request from "supertest";

describe('Authenticate (e2e)', () => {
    let app: INestApplication;
    let prisma: PrismaService;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule],
        })
            .compile();

        app = moduleRef.createNestApplication();

        prisma = moduleRef.get<PrismaService>(PrismaService);

        await app.init();
    });


    test('[POST] /sessions', async () => {
        await prisma.user.create({
            data: {
                name: 'Teste',
                email: 'test@example.com',
                password: await hash('password', 8)
            }
        })

        const response = await request(app.getHttpServer())
            .post('/sessions')
            .send({ email: 'test@example.com', password: 'password' });

        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty('token')
    });
})