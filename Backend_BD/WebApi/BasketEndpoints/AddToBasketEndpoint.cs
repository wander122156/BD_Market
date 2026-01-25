using Backend_BD.AppCore.Interfaces;
using Backend_BD.WebApi.Services;
using FastEndpoints;

namespace Backend_BD.WebApi.BasketEndpoints;

public class AddToBasketEndpoint(
    IBasketService basketService,  // Сервис, не репозиторий т.к. бизнес логика для изменения
    IBasketViewModelService basketViewModelService,
    IBuyerIdService buyerIdService,
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

    public override async Task HandleAsync(AddToBasketRequest request, CancellationToken ct)
    {
        AddToBasketResponse response = new();
        
        Guid correlationId = request.CorrelationId();
        // string username = User.Identity?.Name ?? "anonymous";
        string buyerId = buyerIdService.GetBuyerId(HttpContext, User);

        logger.LogInformation(
            "Добавление товара {ItemId} в корзину. Username: {buyerId}, CorrelationId: {CorrelationId}",
            request.CatalogItemId, buyerId, correlationId);

        var basket = await basketService.AddItemToBasket(
            buyerId,
            request.CatalogItemId,
            request.Price,
            request.Quantity);

        BasketDto basketDto = await basketViewModelService.MapBasketToDto(basket);
        response.Basket = basketDto;
        
        logger.LogInformation(
            "Товар добавлен. Всего в корзине: {ItemCount} товаров. Total: {Total:C}. CorrelationId: {CorrelationId}",
            basketDto.Items.Count, basketDto.Total(), response.CorrelationId);

        await Send.OkAsync(response, ct);
    }
}