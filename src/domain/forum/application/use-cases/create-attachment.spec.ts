import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository';
import { CreateAttachmentUseCase } from './create-attachment';
import { FakeUploader } from 'test/storage/fake-uploader';
import { InvalidAttachmentTypeError } from './errors/invalid-attachment-type';

let sut: CreateAttachmentUseCase;
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository;
let fakeUploader: FakeUploader;

describe('Create Attachment', () => {
  beforeEach(() => {
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository();
    fakeUploader = new FakeUploader();
    sut = new CreateAttachmentUseCase(fakeUploader, inMemoryAttachmentsRepository);
  });

  it('should be able to upload and create an attachment', async () => {
    const result = await sut.execute({
      fileName: 'palmirinha.png',
      fileType: 'image/png',
      body: Buffer.from(''),
    });

    expect(result.isRight()).toBeTruthy();
    expect(result.value).toEqual({
      attachment: inMemoryAttachmentsRepository.items[0],
    });
    expect(fakeUploader.uploads).toHaveLength(1);
    expect(fakeUploader.uploads[0]).toEqual(
      expect.objectContaining({
        fileName: 'palmirinha.png',
      }),
    );
  });

  it('should not be able to upload an invalid type', async () => {
    const result = await sut.execute({
      fileName: 'palmirinha.mp3',
      fileType: 'audio/mpeg',
      body: Buffer.from(''),
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(InvalidAttachmentTypeError);
  });
});
