using Backend_BD.AppCore.Entities.BasketAggregate;
using Backend_BD.WebApi.BasketEndpoints;

namespace Backend_BD.WebApi.Services;

public interface IBasketViewModelService
{
    Task<BasketDto> MapBasketToDto(Basket basket);
    Task<BasketDto> GetOrCreateBasketForUser(string buyerId);
}