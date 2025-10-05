import { AttachmentsRepository } from '@/domain/forum/application/repositories/attachments-repository';
import { Attachment } from '@/domain/forum/enterprise/entities/attachment';
import { PrismaService } from '../prisma.service';
import { PrismaAttachmentsMapper } from '../mappers/prisma-attachments-mapper';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaAttachmentsRepository implements AttachmentsRepository {
  constructor(private prismaService: PrismaService) {}

  async create(attachment: Attachment): Promise<void> {
    const data = PrismaAttachmentsMapper.toPrisma(attachment);

    await this.prismaService.attachment.create({
      data,
    });
  }
}
