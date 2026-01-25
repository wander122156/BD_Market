using Backend_BD.AppCore.Entities.BasketAggregate;
using Backend_BD.AppCore.Interfaces;
using Backend_BD.AppCore.Specifications;
using Backend_BD.WebApi.Services;
using FastEndpoints;

namespace Backend_BD.WebApi.BasketEndpoints;

public class GetBasketEndpoint(
    IRepository<Basket> basketRepository, // Репозиторий, а не сервис, т.к. для чтения
    IBuyerIdService buyerIdService,
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
        
        string buyerId = buyerIdService.GetBuyerId(HttpContext, User);
        
        logger.LogInformation(
            "Получение корзины для пользователя {buyerId}. CorrelationId: {CorrelationId}",
            buyerId, correlationId);

        BasketWithItemsSpecification basketSpec = new(buyerId);
        
        try
        {
            var basketDto = await basketViewModelService.GetOrCreateBasketForUser(buyerId);
            
            response.BasketId = basketDto.Id;
            response.BuyerId = basketDto.BuyerId;
            response.Items.AddRange(basketDto.Items);
            
            logger.LogInformation(
                "Returned basket with {Count} items. Total: {Total:C}. CorrelationId: {CorrelationId}",
                response.Items.Count, response.Total, correlationId);
            
            await Send.OkAsync(response, ct);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Failed to get or create basket for buyer {BuyerId}", buyerId);
            await Send.ErrorsAsync(500, ct);
        }
    }
}