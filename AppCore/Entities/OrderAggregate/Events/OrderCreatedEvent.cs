using Ardalis.SharedKernel;

namespace Backend_BD.Entities.OrderAggregate.Events;
public class OrderCreatedEvent(Order order) : DomainEventBase
{
    public Order Order { get; init; } = order;
}