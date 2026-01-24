using Backend_BD.AppCore.Interfaces;
using FastEndpoints;

namespace Backend_BD.WebApi.BasketEndpoints;

public class AddToBasketEndpoint(
    IBasketService basketService,  // Сервис, не репозиторий т.к. бизнес логика для изменения
    ILogger<AddToBasketEndpoint> logger
)
    : Endpoint<AddToBasketRequest, AddToBasketResponse>
{
    public override void Configure()
    {
        Post("/api/basket/{buyerId}/items");
        AllowAnonymous();
        Description(d => d
            .Produces<AddToBasketResponse>()
            .WithTags("BasketEndpoints"));
    }

    public override async Task HandleAsync(AddToBasketRequest request, CancellationToken ct)
    {
        string buyerId = Route<string>("buyerId");
        
        Guid correlationId = request.CorrelationId();
        // string username = User.Identity?.Name ?? "anonymous";

        logger.LogInformation(
            "Добавление товара {ItemId} в корзину. Username: {Username}, CorrelationId: {CorrelationId}",
            request.CatalogItemId, buyerId, correlationId);

        var basket = await basketService.AddItemToBasket(
            buyerId,
            request.CatalogItemId,
            request.Price,
            request.Quantity);

        AddToBasketResponse response = new(correlationId)
        {
            Basket = new BasketDto
            {
                Id = basket.Id,
                BuyerId = basket.BuyerId,
                Items = basket.Items.Select(item => new BasketItemDto
                {
                    Id = item.Id,
                    CatalogItemId = item.CatalogItemId,
                    UnitPrice = item.UnitPrice,
                    Quantity = item.Quantity,
                }).ToList()
            }
        };

        await Send.OkAsync(response, ct);
    }
}