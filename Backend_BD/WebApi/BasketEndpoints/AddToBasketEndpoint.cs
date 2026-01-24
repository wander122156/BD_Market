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
        Post("/api/basket/items");
        AllowAnonymous();
        Description(d => d
            .Produces<AddToBasketResponse>()
            .WithTags("BasketEndpoints"));
    }

    public override async Task HandleAsync(AddToBasketRequest req, CancellationToken ct)
    {
        AddToBasketResponse response = new();
        Guid correlationId = response.CorrelationId();
        string username = User.Identity?.Name ?? "anonymous";

        logger.LogInformation(
            "Добавление товара {ItemId} в корзину. Username: {Username}, CorrelationId: {CorrelationId}",
            req.CatalogItemId, username, correlationId);

        var basket = await basketService.AddItemToBasket(
            username,
            req.CatalogItemId,
            req.Price,
            req.Quantity);

        response.BasketId = basket.Id;
        response.TotalItems = basket.Items.Sum(i => i.Quantity);
        response.Total = basket.Items.Sum(i => i.UnitPrice * i.Quantity);

        logger.LogInformation(
            "Товар добавлен. BasketId: {BasketId}, Всего товаров: {TotalItems}, CorrelationId: {CorrelationId}",
            response.BasketId, response.TotalItems, correlationId);

        await Send.OkAsync(response, ct);
    }
}