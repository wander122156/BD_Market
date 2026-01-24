using Ardalis.Result;
using Backend_BD.AppCore.Entities.BasketAggregate;
using Backend_BD.AppCore.Interfaces;
using Backend_BD.AppCore.Specifications;

namespace Backend_BD.AppCore.Services;

public class BasketService(
    IRepository<Basket> basketRepository,
    IAppLogger<BasketService> logger
    )
    : IBasketService
{
    public async Task<Basket> AddItemToBasket(string username, int catalogItemId, decimal price, int quantity = 1)
    {
        var basketSpec = new BasketWithItemsSpecification(username);
        var basket = await basketRepository.FirstOrDefaultAsync(basketSpec);

        if (basket == null)
        {
            basket = new Basket(username);
            await basketRepository.AddAsync(basket);
        }

        basket.AddItem(catalogItemId, price, quantity);

        await basketRepository.UpdateAsync(basket);
        return basket;
    }

    public async Task DeleteBasketAsync(int basketId)
    {
        var basket = await basketRepository.GetByIdAsync(basketId);
        ArgumentNullException.ThrowIfNull(basket, nameof(basket));
        await basketRepository.DeleteAsync(basket);
    }

    public async Task<Result<Basket>> SetQuantities(int basketId, Dictionary<string, int> quantities)
    {
        var basketSpec = new BasketWithItemsSpecification(basketId);
        var basket = await basketRepository.FirstOrDefaultAsync(basketSpec);
        if (basket == null) return Result<Basket>.NotFound();

        foreach (var item in basket.Items)
        {
            if (quantities.TryGetValue(item.Id.ToString(), out var quantity))
            {
                if (logger != null) logger.LogInformation("Updating quantity of item ID:{id} to {quantity}.",item.Id, quantity);
                item.SetQuantity(quantity);
            }
        }
        basket.RemoveEmptyItems();
        await basketRepository.UpdateAsync(basket);
        return basket;
    }

    public async Task TransferBasketAsync(string anonymousId, string userName)
    {
        BasketWithItemsSpecification anonymousBasketSpec = new(anonymousId);
        Basket? anonymousBasket = await basketRepository.FirstOrDefaultAsync(anonymousBasketSpec);
        if (anonymousBasket == null) return;
        
        BasketWithItemsSpecification userBasketSpec = new(userName);
        Basket? userBasket = await basketRepository.FirstOrDefaultAsync(userBasketSpec);
        if (userBasket == null)
        {
            userBasket = new Basket(userName);
            await basketRepository.AddAsync(userBasket);
        }
        foreach (BasketItem item in anonymousBasket.Items)
        {
            userBasket.AddItem(item.CatalogItemId, item.UnitPrice, item.Quantity);
        }
        await basketRepository.UpdateAsync(userBasket);
        await basketRepository.DeleteAsync(anonymousBasket);
    }
}