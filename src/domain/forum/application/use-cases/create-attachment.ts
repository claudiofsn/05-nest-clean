import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { InvalidAttachmentTypeError } from './errors/invalid-attachment-type';
import { Attachment } from '../../enterprise/entities/attachment';
import { AttachmentsRepository } from '../repositories/attachments-repository';
import { Uploader } from '../storage/uploader';

interface CreateAttachmentRequest {
  fileName: string;
  fileType: string;
  body: Buffer;
}

type CreateAttachmentResponse = Either<
  InvalidAttachmentTypeError,
  {
    attachment: Attachment;
  }
>;

@Injectable()
export class CreateAttachmentUseCase {
  constructor(
    private uploader: Uploader,
    private attachmentsRepository: AttachmentsRepository,
  ) {}

  async execute({
    fileName,
    fileType,
    body,
  }: CreateAttachmentRequest): Promise<CreateAttachmentResponse> {
    if (!/^(image\/(png|jpe?g)|application\/pdf)$/.test(fileType)) {
      return left(new InvalidAttachmentTypeError(fileType));
    }

    const { url } = await this.uploader.upload({
      fileName,
      fileType,
      body,
    });

    const attachment = Attachment.create({
      title: fileName,
      url,
    });

    await this.attachmentsRepository.create(attachment);

    return right({ attachment });
  }
}
