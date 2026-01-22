using Ardalis.SharedKernel;

namespace Backend_BD.AppCore.Entities.OrderAggregate.Events;
public class OrderCreatedEvent(Order order) : DomainEventBase
{
    public Order Order { get; init; } = order;
}