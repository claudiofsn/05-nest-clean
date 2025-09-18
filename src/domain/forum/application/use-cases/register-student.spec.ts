import { RegisterStudentUseCase } from './register-student';
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository';
import { FakeHasher } from 'test/cryptography/fake-hasher';

let sut: RegisterStudentUseCase;
let studentsRepository: InMemoryStudentsRepository;
let fakeHasher: FakeHasher;

describe('Register Student', () => {
  beforeEach(() => {
    studentsRepository = new InMemoryStudentsRepository();
    fakeHasher = new FakeHasher();
    sut = new RegisterStudentUseCase(studentsRepository, fakeHasher);
  });

  it('should be able to register a new student', async () => {
    const result = await sut.execute({
      email: 'student@example.com',
      name: 'Student Name',
      password: 'teste123',
    });

    expect(result.isRight()).toBeTruthy();
    expect(result.value).toEqual({
      student: studentsRepository.items[0],
    });
  });

  it('should hash student password upon register', async () => {
    const password = 'teste123';

    const result = await sut.execute({
      email: 'student@example.com',
      name: 'Student Name',
      password,
    });

    const hashedPassword = await fakeHasher.hash(password);

    expect(result.isRight()).toBeTruthy();
    expect(studentsRepository.items[0].password).toEqual(hashedPassword);
  });
});
