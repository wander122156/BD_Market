using Backend_BD.AppCore.Interfaces;
using Backend_BD.AppCore.Specifications;
using Backend_BD.WebApi.Services;
using FastEndpoints;
using Order = Backend_BD.AppCore.Entities.OrderAggregate.Order;

namespace Backend_BD.WebApi.OrderEndpoints;

public class GetOrderByIdEndpoint(
    IOrderService orderService,
    IBuyerIdService buyerIdService,
    ILogger<GetOrderByIdEndpoint> logger
    )
    : EndpointWithoutRequest<GetOrderByIdResponse>
{
    public override void Configure()
    {
        Get("/api/orders/{id}");
        AllowAnonymous();
        Description(d => d
            .Produces<GetOrderByIdResponse>(200)
            .WithTags("OrderEndpoints"));
    }

    public override async Task HandleAsync(CancellationToken ct)
    {
        var response = new GetOrderByIdResponse();
        Guid correlationId = response.CorrelationId();
        
        int orderId = Route<int>("id");
        
        logger.LogInformation("Fetching order {OrderId}. CorrelationId: {CorrelationId}", orderId, correlationId);

        // string buyerId = User?.Identity?.Name ?? "anonymous";
        string buyerId = buyerIdService.GetBuyerId(HttpContext, User);
        
        var spec = new OrderWithItemsByIdSpec(orderId);
        
        Order? order = await orderService.GetOrderByIdAsync(orderId);

        if (order == null)
        {
            logger.LogWarning("Order {OrderId} not found for user {BuyerId}. CorrelationId: {CorrelationId}", 
                orderId, buyerId, correlationId);
            await Send.NotFoundAsync(ct);
            return;
        }

        logger.LogInformation("Order {OrderId} found for user {BuyerId}. CorrelationId: {CorrelationId}",
            orderId, buyerId, correlationId);

        response.Order = new OrderDto
        {
            Id = order.Id,
            BuyerId = order.BuyerId,
            OrderDate = order.OrderDate,
            ShipToAddress = new AddressDto
            {
                Street = order.ShipToAddress.Street,
                City = order.ShipToAddress.City,
                State = order.ShipToAddress.State,
                Country = order.ShipToAddress.Country,
                ZipCode = order.ShipToAddress.ZipCode
            },
            Items = order.OrderItems.Select(oi => new OrderItemDto
            {
                Id = oi.Id,
                CatalogItemId = oi.ItemOrdered.CatalogItemId,
                ProductName = oi.ItemOrdered.ProductName,
                PictureUrl = oi.ItemOrdered.PictureUri,
                UnitPrice = oi.UnitPrice,
                Units = oi.Units
            }).ToList(),
            Total = order.Total()
        };

        await Send.OkAsync(response ,ct);
    }
}