using Backend_BD.AppCore.Entities.OrderAggregate;

namespace Backend_BD.AppCore.Interfaces;

public interface IOrderService
{
    Task<Order> CreateOrderAsync(string buyerId, Address shippingAddress);
    Task<Order?> GetOrderByIdAsync(int orderId);
    Task<List<Order>> GetOrdersByUserAsync(string buyerId);
}