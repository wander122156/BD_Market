using Backend_BD.AppCore.Entities.BasketAggregate;
using Backend_BD.AppCore.Interfaces;
using Backend_BD.AppCore.Specifications;
using FastEndpoints;

namespace Backend_BD.WebApi.BasketEndpoints;

public class GetBasketEndpoint(
    IRepository<Basket> basketRepository, // Репозиторий, а не сервис, т.к. для чтения
    ILogger<GetBasketEndpoint> logger)

: EndpointWithoutRequest<GetBasketResponse>
{
    public override void Configure()
    {
        Get("/api/basket");
        AllowAnonymous();
        Description(d => d
            .Produces<GetBasketResponse>()
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

        response.BasketId = basket.Id;
        response.BuyerId = basket.BuyerId;
        response.Items.AddRange(basket.Items.Select(i => new 
            BasketItemDto
        {
            Id = i.Id,
            CatalogItemId = i.CatalogItemId,
            UnitPrice = i.UnitPrice,
            Quantity = i.Quantity
        }));
        response.Total = basket.Items.Sum(i => i.UnitPrice * i.Quantity);

        await Send.OkAsync(response, ct);

    }
}