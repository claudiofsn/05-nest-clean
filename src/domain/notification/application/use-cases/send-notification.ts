import { Either, right } from '@/core/either';
import { Notification } from '../../enterprise/entities/notification';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { NotificationsRepository } from '../repositories/notifications-repository';
import { Injectable } from '@nestjs/common';

export interface SendNotificationRequest {
  recipientId: string;
  title: string;
  content: string;
}

export type SendNotificationResponse = Either<null, { notification: Notification }>;

@Injectable()
export class SendNotificationUseCase {
  constructor(private notificationsRepository: NotificationsRepository) {}

  async execute({
    recipientId,
    title,
    content,
  }: SendNotificationRequest): Promise<SendNotificationResponse> {
    const notification = Notification.create({
      recipientId: new UniqueEntityID(recipientId),
      title,
      content,
    });

    await this.notificationsRepository.create(notification);
    return right({
      notification,
    });
  }
}
