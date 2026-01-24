using Ardalis.Result;
using Backend_BD.AppCore.Entities.BasketAggregate;

namespace Backend_BD.AppCore.Interfaces;

// Содержит бизнес-логику работы с корзиной, которая не зависит от способа доставки (MVC, API)
public interface IBasketService
{
    Task TransferBasketAsync(string anonymousId, string userName);
    Task<Basket> AddItemToBasket(string username, int catalogItemId, decimal price, int quantity = 1);
    Task<Result<Basket>> SetQuantities(int basketId, Dictionary<string, int> quantities);
    Task DeleteBasketAsync(int basketId);
}