using Backend_BD.AppCore.Entities;
using Backend_BD.AppCore.Entities.BasketAggregate;
using Backend_BD.AppCore.Entities.OrderAggregate;
using Backend_BD.AppCore.Entities.OrderAggregate.Events;
using Backend_BD.AppCore.Interfaces;
using Backend_BD.AppCore.Specifications;

namespace Backend_BD.AppCore.Services;

public class OrderService(
    IRepository<Order> orderRepository,
    IRepository<Basket> basketRepository,
    IRepository<CatalogItem> catalogItemRepository,
    IUriComposer uriComposer,
    IAppLogger<OrderService> logger
    ) 
    : IOrderService
{
    public async Task<Order> CreateOrderAsync(string buyerId, Address shippingAddress)
    {
        BasketWithItemsSpecification basketSpec = new(buyerId);
        Basket? basket = await basketRepository.FirstOrDefaultAsync(basketSpec);

        if (basket == null || basket.Items.Count == 0)
        {
            throw new InvalidOperationException("Basket is empty or not found");
        }

        var catalogItemIds = basket.Items.Select(item => item.CatalogItemId).ToArray();
        var catalogItemsSpec = new CatalogItemsSpecification(catalogItemIds);
        var catalogItems = await catalogItemRepository.ListAsync(catalogItemsSpec);

        // Cнимок товара
        var orderItems = basket.Items.Select(basketItem =>
        {
            var catalogItem = catalogItems.First(c => c.Id == basketItem.CatalogItemId);
            
            var itemOrdered = new CatalogItemOrdered(
                catalogItem.Id,
                catalogItem.Name,
                uriComposer.ComposePicUri(catalogItem.PictureUri)
            );
            
            return new OrderItem(
                itemOrdered,
                (int)basketItem.UnitPrice,
                basketItem.Quantity
            );
        }).ToList();

        Order order = new(buyerId, shippingAddress, orderItems);
        
        await orderRepository.AddAsync(order);

        // Очистка корзины после создания заказа
        await basketRepository.DeleteAsync(basket);

        logger.LogInformation(
            "Order {OrderId} created for user {BuyerId} with {ItemCount} items. Total: {Total}",
            order.Id, buyerId, orderItems.Count, order.Total());

        return order;
    }

    public async Task<Order?> GetOrderByIdAsync(int orderId)
    {
        // детали
        var orderSpec = new OrderWithItemsByIdSpec(orderId);
        return await orderRepository.FirstOrDefaultAsync(orderSpec);
    }

    public async Task<List<Order>> GetOrdersByUserAsync(string buyerId)
    {
        var ordersSpec = new CustomerOrdersWithItemsSpecification(buyerId);
        return await orderRepository.ListAsync(ordersSpec);
    }
}
