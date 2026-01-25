using Ardalis.Specification;
using Backend_BD.AppCore.Entities.OrderAggregate;

namespace Backend_BD.AppCore.Specifications;

public class CustomerOrdersWithItemsSpecification : Specification<Order>
{
    public CustomerOrdersWithItemsSpecification(string buyerId)
    {
        Query
            .Where(o => o.BuyerId == buyerId)
            .Include(o => o.OrderItems)
            .ThenInclude(i => i.ItemOrdered) // Полные данные товара
            .OrderByDescending(o => o.OrderDate);
    }
}