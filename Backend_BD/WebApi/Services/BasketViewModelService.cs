using Backend_BD.AppCore.Entities;
using Backend_BD.AppCore.Entities.BasketAggregate;
using Backend_BD.AppCore.Interfaces;
using Backend_BD.AppCore.Specifications;
using Backend_BD.WebApi.BasketEndpoints;

namespace Backend_BD.WebApi.Services;
public class BasketViewModelService(
    IRepository<CatalogItem> catalogItemRepository,
    IUriComposer uriComposer,
    IAppLogger<BasketViewModelService> logger
) 
    : IBasketViewModelService
{
    public async Task<BasketDto> MapBasketToDto(Basket basket)
    {
        var catalogItemIds = basket.Items.Select(b => b.CatalogItemId).ToArray();
        
        if (catalogItemIds.Length == 0)
        {
            return new BasketDto
            {
                Id = basket.Id,
                BuyerId = basket.BuyerId,
                Items = new List<BasketItemDto>()
            };
        }

        var catalogItemsSpec = new CatalogItemsSpecification(catalogItemIds);
        var catalogItems = await catalogItemRepository.ListAsync(catalogItemsSpec);

        var items = basket.Items.Select(basketItem =>
        {
            var catalogItem = catalogItems.First(c => c.Id == basketItem.CatalogItemId);

            return new BasketItemDto
            {
                Id = basketItem.Id,
                CatalogItemId = basketItem.CatalogItemId,
                ProductName = catalogItem.Name,
                UnitPrice = basketItem.UnitPrice,
                OldUnitPrice = catalogItem.Price, // Текущая цена товара (может отличаться от цены в корзине)
                Quantity = basketItem.Quantity,
                PictureUrl = uriComposer.ComposePicUri(catalogItem.PictureUri)
            };
        }).ToList();

        return new BasketDto
        {
            Id = basket.Id,
            BuyerId = basket.BuyerId,
            Items = items
        };
    }
}