import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository'
import { ReadNotificationUseCase } from './read-notification'
import { makeNotification } from 'test/factories/make-notification'
import { NotAllowedError } from '@/domain/forum/application/use-cases/errors/not-allowed-error'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

let sut: ReadNotificationUseCase
let notificationsRepository: InMemoryNotificationsRepository

describe('Read Notification', () => {
  beforeEach(() => {
    notificationsRepository = new InMemoryNotificationsRepository()
    sut = new ReadNotificationUseCase(notificationsRepository)
  })

  it('should be able to read a notification', async () => {
    const notification = makeNotification()

    await notificationsRepository.create(notification)

    const result = await sut.execute({
      notificationId: notification.id.toString(),
      recipientId: notification.recipientId.toString(),
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(notificationsRepository.items[0].readAt).toEqual(expect.any(Date))
    }
  })

  it('should not be able to read a notification from another recipient', async () => {
    const notification = makeNotification({
      recipientId: new UniqueEntityID('recipient-id-1'),
    })

    await notificationsRepository.create(notification)

    const result = await sut.execute({
      notificationId: notification.id.toString(),
      recipientId: 'recipient-id-2',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
