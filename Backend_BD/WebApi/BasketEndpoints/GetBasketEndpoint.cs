using Backend_BD.AppCore.Entities.BasketAggregate;
using Backend_BD.AppCore.Interfaces;
using Backend_BD.AppCore.Specifications;
using Backend_BD.WebApi.Services;
using FastEndpoints;

namespace Backend_BD.WebApi.BasketEndpoints;

public class GetBasketEndpoint(
    IRepository<Basket> basketRepository, // Репозиторий, а не сервис, т.к. для чтения
    IBasketViewModelService basketViewModelService,
    ILogger<GetBasketEndpoint> logger
    )
    : EndpointWithoutRequest<GetBasketResponse>
{
    public override void Configure()
    {
        Get("/api/basket");
        AllowAnonymous(); // Options(x => x.RequireAuthorization())
        Description(d => d
            .Produces<GetBasketResponse>()
            .Produces(404)
            .WithTags("BasketEndpoints"));
    }
    
    public override async Task HandleAsync(CancellationToken ct)
    {
        GetBasketResponse response = new();
        Guid correlationId = response.CorrelationId();
        string username = User.Identity?.Name ?? "anonymous"; // Пока без авторизации
        
        logger.LogInformation(
            "Получение корзины для пользователя {Username}. CorrelationId: {CorrelationId}",
            username, correlationId);

        BasketWithItemsSpecification basketSpec = new(username);
        Basket? basket = await basketRepository.FirstOrDefaultAsync(basketSpec, ct);
        
        if (basket == null)
        {
            await Send.NotFoundAsync(ct);
            return;
        }
        
        var basketDto = await basketViewModelService.MapBasketToDto(basket);

        response.BasketId = basket.Id;
        response.BuyerId = basket.BuyerId;
        response.Items.AddRange(basketDto.Items);
        
        logger.LogInformation(
            "Возвращена корзина с {Count} товарами. Total: {Total:C}. CorrelationId: {CorrelationId}",
            response.Items.Count, response.Total, response.CorrelationId);

        await Send.OkAsync(response, ct);
    }
}