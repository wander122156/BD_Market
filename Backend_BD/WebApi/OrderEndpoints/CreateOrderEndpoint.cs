using Backend_BD.AppCore.Entities.OrderAggregate;
using Backend_BD.AppCore.Interfaces;
using Backend_BD.WebApi.Services;
using FastEndpoints;

namespace Backend_BD.WebApi.OrderEndpoints;

public class CreateOrderEndpoint(
    IOrderService orderService,
    IBuyerIdService buyerIdService,
    ILogger<CreateOrderEndpoint> logger
) : Endpoint<CreateOrderRequest, CreateOrderResponse>
{
    public override void Configure()
    {
        Post("/api/orders");
        AllowAnonymous(); // TODO: Options(x => x.RequireAuthorization())
        Description(d => d
            .Produces<CreateOrderResponse>(200)
            .Produces(400)
            .WithTags("OrderEndpoints"));
    }

    public override async Task HandleAsync(CreateOrderRequest request, CancellationToken ct)
    {
        var response = new CreateOrderResponse(request.CorrelationId());
        // string buyerId = User.Identity?.Name ?? "anonymous";
        string buyerId = buyerIdService.GetBuyerId(HttpContext, User);
        
        logger.LogInformation(
            "Creating order for user {BuyerId}. CorrelationId: {CorrelationId}",
            buyerId, response.CorrelationId);

        var address = new Address(
            request.Street,
            request.City,
            request.State,
            request.Country,
            request.ZipCode
        );

        try
        {
            var order = await orderService.CreateOrderAsync(buyerId, address);

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
                Items = order.OrderItems.Select(item => new OrderItemDto
                {
                    Id = item.Id,
                    CatalogItemId = item.ItemOrdered.CatalogItemId,
                    ProductName = item.ItemOrdered.ProductName,
                    PictureUrl = item.ItemOrdered.PictureUri,
                    UnitPrice = item.UnitPrice,
                    Units = item.Units
                }).ToList(),
                Total = order.Total()
            };

            logger.LogInformation(
                "Order {OrderId} created. Total: {Total:C}. CorrelationId: {CorrelationId}",
                order.Id, order.Total(), response.CorrelationId);

            await Send.OkAsync(response, ct);
        }
        catch (InvalidOperationException ex)
        {
            logger.LogWarning(
                "Failed to create order: {Message}. CorrelationId: {CorrelationId}",
                ex.Message, response.CorrelationId);

            await Send.ErrorsAsync(400, ct); // TODO исправить на правильную ошибку
        }
    }
}