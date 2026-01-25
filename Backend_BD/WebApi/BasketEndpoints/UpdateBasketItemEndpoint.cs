using Backend_BD.AppCore.Entities.BasketAggregate;
using Backend_BD.AppCore.Interfaces;
using Backend_BD.AppCore.Specifications;
using Backend_BD.WebApi.Services;
using FastEndpoints;

namespace Backend_BD.WebApi.BasketEndpoints;

public class UpdateBasketItemEndpoint(
    IRepository<Basket> basketRepository,
    IBuyerIdService buyerIdService,
    IBasketViewModelService basketViewModelService,
    ILogger<UpdateBasketItemEndpoint> logger
)
    : Endpoint<UpdateBasketItemRequest, UpdateBasketItemResponse>
{
    public override void Configure()
    {
        Put("/api/basket/items/{BasketItemId}");
        AllowAnonymous(); // TODO: Options(x => x.RequireAuthorization())
        Description(d => d
            .Produces<UpdateBasketItemResponse>(200)
            .Produces(404)
            .Produces(400)
            .WithTags("BasketEndpoints"));
    }

    public override async Task HandleAsync(UpdateBasketItemRequest request, CancellationToken ct)
    {
        UpdateBasketItemResponse response = new(request.CorrelationId());
        
        string buyerId = buyerIdService.GetBuyerId(HttpContext, User);

        logger.LogInformation(
            "Обновление количества товара {BasketItemId} на {Quantity} для пользователя {buyerId}. CorrelationId: {CorrelationId}",
            request.BasketItemId, request.Quantity, buyerId, response.CorrelationId);

        // Получаем корзину пользователя
        var basketSpec = new BasketWithItemsSpecification(buyerId);
        var basket = await basketRepository.FirstOrDefaultAsync(basketSpec, ct);
        
        if (basket == null)
        {
            logger.LogWarning(
                "Корзина не найдена для пользователя {buyerId}. CorrelationId: {CorrelationId}",
                buyerId, response.CorrelationId);
            
            await Send.NotFoundAsync(ct);
            return;
        }

        // Находим товар в корзине
        var basketItem = basket.Items.FirstOrDefault(i => i.Id == request.BasketItemId);
        
        if (basketItem == null)
        {
            logger.LogWarning(
                "Товар {BasketItemId} не найден в корзине пользователя {buyerId}. CorrelationId: {CorrelationId}",
                request.BasketItemId, buyerId, response.CorrelationId);
            
            await Send.NotFoundAsync(ct);
            return;
        }

        if (basket.BuyerId != buyerId)
        {
            logger.LogWarning(
                "Попытка изменить чужую корзину. User: {buyerId}, Basket: {BuyerId}. CorrelationId: {CorrelationId}",
                buyerId, basket.BuyerId, response.CorrelationId);
            
            await Send.ForbiddenAsync(ct);
            return;
        }

        basketItem.SetQuantity(request.Quantity);
        
        await basketRepository.UpdateAsync(basket, ct);

        var basketDto = await basketViewModelService.MapBasketToDto(basket);
        response.Basket = basketDto;

        logger.LogInformation(
            "Количество обновлено. Товар {BasketItemId} теперь {Quantity} шт. Total: {Total:C}. CorrelationId: {CorrelationId}",
            request.BasketItemId, request.Quantity, basketDto.Total(), response.CorrelationId);

        await Send.OkAsync(response, ct);
    }
}