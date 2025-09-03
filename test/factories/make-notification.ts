import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Notification,
  NotificationProps,
} from '@/domain/notification/enterprise/entities/notification'
import { faker } from '@faker-js/faker'

export function makeNotification(
  override: Partial<NotificationProps> = {},
  id?: UniqueEntityID,
): Notification {
  return Notification.create(
    {
      title: faker.lorem.sentence(),
      content: faker.lorem.paragraph(),
      recipientId: new UniqueEntityID(),
      ...override,
    },
    id,
  )
}
