using Backend_BD.AppCore.Interfaces;
using Backend_BD.AppCore.Specifications;
using Backend_BD.WebApi.Services;
using FastEndpoints;
using Order = Backend_BD.AppCore.Entities.OrderAggregate.Order;

namespace Backend_BD.WebApi.OrderEndpoints;

public class ListOrdersEndpoint(
    IRepository<Order> orderRepository,
    IBuyerIdService buyerIdService,
    ILogger<ListOrdersEndpoint> logger
    )
    : EndpointWithoutRequest<ListOrdersResponse>
{

    public override void Configure()
    {
        Get("/api/orders");
        AllowAnonymous();
        Description(d => d
            .Produces<ListOrdersResponse>(200)
            .WithTags("OrderEndpoints"));
    }

    public override async Task HandleAsync(CancellationToken ct)
    {
        var response = new ListOrdersResponse();
        Guid correlationId = response.CorrelationId();
        
        logger.LogInformation("Fetching all orders. CorrelationId: {CorrelationId}", correlationId);

        string buyerId = buyerIdService.GetBuyerId(HttpContext, User);
        
        var spec = new OrdersWithItemsSpecification(buyerId);
        
        List<Order> orders = await orderRepository.ListAsync(spec, ct);

        if (!orders.Any())
        {
            logger.LogWarning("No orders found for user {BuyerId}. CorrelationId: {CorrelationId}", 
                buyerId, correlationId);
            await Send.NotFoundAsync(ct);
            return;
        }

        logger.LogInformation("Found {Count} orders for user {BuyerId}. CorrelationId: {CorrelationId}",
            orders.Count, buyerId, correlationId);

        response.Orders = orders.Select(o => new OrderDto
        {
            Id = o.Id,
            BuyerId = o.BuyerId,
            OrderDate = o.OrderDate,
            ShipToAddress = new AddressDto
            {
                Street = o.ShipToAddress.Street,
                City = o.ShipToAddress.City,
                State = o.ShipToAddress.State,
                Country = o.ShipToAddress.Country,
                ZipCode = o.ShipToAddress.ZipCode
            },
            Items = o.OrderItems.Select(oi => new OrderItemDto
            {
                Id = oi.Id,
                CatalogItemId = oi.ItemOrdered.CatalogItemId,
                ProductName = oi.ItemOrdered.ProductName,
                PictureUrl = oi.ItemOrdered.PictureUri,
                UnitPrice = oi.UnitPrice,
                Units = oi.Units
            }).ToList(),
            Total = o.Total()
        }).ToList();
        
        await Send.OkAsync(response, ct);
    }
}