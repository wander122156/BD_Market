using Backend_BD.AppCore.Entities.BasketAggregate;
using Backend_BD.AppCore.Interfaces;
using Backend_BD.AppCore.Specifications;
using Backend_BD.WebApi.Services;
using FastEndpoints;

namespace Backend_BD.WebApi.BasketEndpoints;

public class DeleteBasketItemEndpoint(
    IBasketService basketService,
    IBuyerIdService buyerIdService,
    IRepository<Basket> basketRepository,
    IBasketViewModelService basketViewModelService,
    ILogger<DeleteBasketItemEndpoint> logger
)
    : Endpoint<DeleteBasketItemRequest, DeleteBasketItemResponse>
{
    public override void Configure()
    {
        Delete("/api/basket/items/{BasketItemId}");
        AllowAnonymous();
        Description(d => d
            .Produces<DeleteBasketItemResponse>(200)
            .Produces(404)
            .WithTags("BasketEndpoints"));
    }

    public override async Task HandleAsync(DeleteBasketItemRequest request, CancellationToken ct)
    {
        var response = new DeleteBasketItemResponse(request.CorrelationId());
        // string username = User.Identity?.Name ?? "anonymous";
        string buyerId = buyerIdService.GetBuyerId(HttpContext, User);

        logger.LogInformation(
            "Удаление товара {BasketItemId} из корзины пользователя {buyerId}. CorrelationId: {CorrelationId}",
            request.BasketItemId, buyerId, response.CorrelationId);

        var basketSpec = new BasketWithItemsSpecification(buyerId);
        var basket = await basketRepository.FirstOrDefaultAsync(basketSpec, ct);
        
        if (basket == null)
        {
            await Send.NotFoundAsync(ct);
            return;
        }

        var basketItem = basket.Items.FirstOrDefault(i => i.Id == request.BasketItemId);
        if (basketItem == null)
        {
            await Send.NotFoundAsync(ct);
            return;
        }

        // Используем существующий метод SetQuantities!
        var quantities = new Dictionary<string, int>
        {
            { request.BasketItemId.ToString(), 0 } // Устанавливаем 0
        };
        
        var result = await basketService.SetQuantities(basket.Id, quantities);
        
        if (!result.IsSuccess)
        {
            await Send.NotFoundAsync(ct);
            return;
        }

        var basketDto = await basketViewModelService.MapBasketToDto(result.Value);
        response.Basket = basketDto;

        logger.LogInformation(
            "Товар удален. Осталось {ItemCount} товаров. Total: {Total:C}. CorrelationId: {CorrelationId}",
            basketDto.Items.Count, basketDto.Total(), response.CorrelationId);

        await Send.OkAsync(response, ct);
    }
}