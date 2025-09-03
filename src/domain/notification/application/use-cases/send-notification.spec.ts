import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository'
import { SendNotificationUseCase } from './send-notification'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

let notificationsRepository: InMemoryNotificationsRepository
let sut: SendNotificationUseCase

describe('Send Notification', () => {
  beforeEach(() => {
    notificationsRepository = new InMemoryNotificationsRepository()
    sut = new SendNotificationUseCase(notificationsRepository)
  })

  it('should be able to send a notification', async () => {
    const response = await sut.execute({
      content: 'Nova solicitação de amizade',
      title: 'Solicitação de Amizade',
      recipientId: new UniqueEntityID().toString(),
    })

    expect(response.isRight()).toBe(true)
    expect(notificationsRepository.items).toHaveLength(1)

    if (response.isRight()) {
      const { notification } = response.value
      expect(notificationsRepository.items[0]).toEqual(notification)
    }
  })
})
