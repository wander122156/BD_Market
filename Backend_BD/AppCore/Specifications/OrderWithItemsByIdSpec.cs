using Ardalis.Specification;
using Backend_BD.AppCore.Entities.OrderAggregate;

namespace Backend_BD.AppCore.Specifications;

public class OrderWithItemsByIdSpec : Specification<Order>
{
    public OrderWithItemsByIdSpec(int orderId)
    {
        Query
            .Where(order => order.Id == orderId)
            .Include(o => o.OrderItems)
            .ThenInclude(i => i.ItemOrdered);
    }
}