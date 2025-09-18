import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository';
import { FakeHasher } from 'test/cryptography/fake-hasher';
import { AuthenticateStudentUseCase } from './authenticate-student';
import { FakeEncrypter } from 'test/cryptography/fake-encrypter';
import { makeStudent } from '../../../../../test/factories/make-student';

let sut: AuthenticateStudentUseCase;
let studentsRepository: InMemoryStudentsRepository;
let fakeHasher: FakeHasher;
let fakeEncrypter: FakeEncrypter;

describe('Authenticate Student', () => {
  beforeEach(() => {
    studentsRepository = new InMemoryStudentsRepository();
    fakeHasher = new FakeHasher();
    fakeEncrypter = new FakeEncrypter();
    sut = new AuthenticateStudentUseCase(studentsRepository, fakeHasher, fakeEncrypter);
  });

  it('should be able to register a new student', async () => {
    const student = makeStudent({
      email: 'student@example.com',
      password: await fakeHasher.hash('teste123'),
    });

    studentsRepository.items.push(student);

    const result = await sut.execute({
      email: 'student@example.com',
      password: 'teste123',
    });

    expect(result.isRight()).toBeTruthy();
    expect(result.value).toEqual({
      accessToken: expect.any(String),
    });
  });
});
