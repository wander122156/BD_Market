using Ardalis.Specification;
using Backend_BD.AppCore.Entities.OrderAggregate;

namespace Backend_BD.AppCore.Specifications;

public class OrdersWithItemsSpecification : Specification<Order>
{
    public OrdersWithItemsSpecification(string buyerId)
    {
        Query.Where(o => o.BuyerId == buyerId)
            .Include(o => o.OrderItems)
            .ThenInclude(i => i.ItemOrdered);
    }
}