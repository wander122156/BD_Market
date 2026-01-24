using Backend_BD.AppCore.Entities;
using Backend_BD.AppCore.Interfaces;
using FastEndpoints;

namespace Backend_BD.WebApi.CatalogTypeEndpoints;

public class CatalogTypeListEndpoint(
        IRepository<CatalogType> catalogTypeRepository, 
        ILogger<CatalogTypeListEndpoint> logger
    )
    : EndpointWithoutRequest<ListCatalogTypesResponse>
{
    public override void Configure()
    {
        Get("/api/catalog-types");
        AllowAnonymous();
        Description(d =>
            d.Produces<ListCatalogTypesResponse>()
                .WithTags("ListCatalogTypes"));
    }

    public override async Task HandleAsync(CancellationToken ct)
    {
        ListCatalogTypesResponse response = new();
        Guid correlationId = response.CorrelationId();
        
        logger.LogInformation(
            "Начало обработки запроса на получение списка типов товаров каталога. CorrelationId: {CorrelationId}", 
            correlationId);

        List<CatalogType> items = await catalogTypeRepository.ListAsync(ct);
        
        logger.LogInformation(
            "Получено {Count} типов товаров каталога из БД. CorrelationId: {CorrelationId}",
            items.Count, 
            correlationId);
        
        response.CatalogTypes.AddRange(items.Select(i => 
            new CatalogTypeDto
            {
                Id = i.Id,
                Name = i.Type,
            }));
        
        logger.LogInformation(
            "Запрос успешно обработан. Отправлено {Count} типов товаров каталога. CorrelationId: {CorrelationId}", 
            response.CatalogTypes.Count, 
            correlationId);
        
        await Send.OkAsync(response, ct);
    }
}