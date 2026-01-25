using Backend_BD.AppCore.Interfaces;

namespace Backend_BD.AppCore.Entities.OrderAggregate;

public class Order: BaseEntity, IAggregateRoot
{
    #pragma warning disable CS8618 // Required by Entity Framework
    private Order() {}

    public Order(string buyerId, Address shipToAddress, List<OrderItem> orderItems)
    {
        BuyerId = buyerId;
        ShipToAddress = shipToAddress;
        _orderItems = orderItems;
    }
    
    public string BuyerId { get; private set; }
    public DateTimeOffset OrderDate { get; private set; } = DateTimeOffset.UtcNow;
    public Address ShipToAddress { get; private set; }
    private readonly List<OrderItem> _orderItems = [];
    
    public IReadOnlyCollection<OrderItem> OrderItems => _orderItems.AsReadOnly();
    
    public decimal Total()
    {
        decimal total = 0m;
        foreach (var item in _orderItems)
        {
            total += item.UnitPrice * item.Units;
        }
        return total;
    }
}