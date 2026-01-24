using Backend_BD.AppCore.Entities;
using Backend_BD.AppCore.Interfaces;
using FastEndpoints;

namespace Backend_BD.WebApi.CatalogItemEndpoints;

public class CatalogItemListPagedEndpoint(
        IRepository<CatalogItem> catalogItemRepository,
        ILogger<CatalogItemListPagedEndpoint> logger
    ) 
    : Endpoint<ListPagedCatalogItemRequest, ListPagedCatalogItemResponse>   
{
    public override void Configure()
    {
        Get("api/catalog-items");
        AllowAnonymous();
        Description(d =>
            d.Produces<ListPagedCatalogItemResponse>()
                .WithTags("CatalogItemEndpoints"));
    }

    public override async Task HandleAsync(ListPagedCatalogItemRequest request, CancellationToken ct)
    {
        ListPagedCatalogItemResponse response = new(request.CorrelationId());
        
        int totalItems = await catalogItemRepository.CountAsync(ct);
        
        List<CatalogItem> items = await catalogItemRepository.ListAsync(ct);
        
        response.CatalogItems.AddRange(items.Select(i=> new CatalogItemDto
            {
                Id = i.Id,
                CatalogBrandId = i.CatalogBrandId,
                CatalogTypeId = i.CatalogTypeId,
                Name = i.Name,
                Description = i.Description,
                Price = i.Price,
                PictureUri = i.PictureUri,
            } ));
        
        if (request.PageSize > 0)
        {
            response.PageCount = (int)Math.Ceiling((decimal)totalItems / request.PageSize);
        }
        else
        {
            response.PageCount = totalItems > 0 ? 1 : 0;
        }
        
        logger.LogInformation(
            "Возвращено {Count} товаров из {Total}. Страниц: {PageCount}. CorrelationId: {CorrelationId}",
            response.CatalogItems.Count, totalItems, response.PageCount, response.CorrelationId);
        
        await Send.OkAsync(response, ct);
    }
}