using Backend_BD.AppCore.Entities;
using Backend_BD.AppCore.Interfaces;
using FastEndpoints;

namespace Backend_BD.WebApi.CatalogBrandEndpoints;

public class CatalogBrandListEndpoint(
        IRepository<CatalogBrand> catalogBrandRepository, 
        ILogger<CatalogBrandListEndpoint> logger
    )
    : EndpointWithoutRequest<ListCatalogBrandsResponse>
{
    public override void Configure()
    {
        Get("/api/catalog-brands");
        AllowAnonymous(); // Не нужен токен авторизации, доступ для всех
        Description(d =>
            d.Produces<ListCatalogBrandsResponse>()
                .WithTags("CatalogBrandEndpoints") ); // Для Swagger
    }

    public override async Task HandleAsync(CancellationToken ct)
    {
        ListCatalogBrandsResponse response = new();
        Guid correlationId = response.CorrelationId();
        
        logger.LogInformation(
            "Начало обработки запроса на получение списка брендов. CorrelationId: {CorrelationId}", 
            correlationId);
        
        List<CatalogBrand> items = await catalogBrandRepository.ListAsync(ct);
        
        logger.LogInformation(
            "Получено {Count} брендов из БД. CorrelationId: {CorrelationId}", 
            items.Count, 
            correlationId);
        
        response.CatalogBrands.AddRange(items.Select(i =>
            new CatalogBrandDto
            {
                Id = i.Id,
                Name = i.Brand,
            }));
        logger.LogInformation(
            "Запрос успешно обработан. Отправлено {Count} брендов. CorrelationId: {CorrelationId}", 
            response.CatalogBrands.Count, 
            correlationId);
        
        await Send.OkAsync(response, ct);
    }
}   