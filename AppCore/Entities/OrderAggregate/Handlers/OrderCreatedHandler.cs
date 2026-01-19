using Backend_BD.Entities.OrderAggregate.Events;
using Backend_BD.Interfaces;
using Mediator;

namespace Backend_BD.Entities.OrderAggregate.Handlers;

// Это обработчик доменного события (Domain Event Handler), который реагирует на создание заказа и отправляет email уведомление
public class OrderCreatedHandler(ILogger<OrderCreatedHandler> logger, IEmailSender emailSender) : INotificationHandler<OrderCreatedEvent>
{
    public async ValueTask Handle(OrderCreatedEvent domainEvent, CancellationToken cancellationToken)
    {
        logger.LogInformation("Order #{orderId} placed: ", domainEvent.Order.Id);

        await emailSender.SendEmailAsync("to@test.com",
            "Order Created",
            $"Order with id {domainEvent.Order.Id} was created.");
    }
}