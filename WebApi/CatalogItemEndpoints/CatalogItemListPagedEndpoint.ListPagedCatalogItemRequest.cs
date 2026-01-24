namespace Backend_BD.WebApi.CatalogItemEndpoints;

public class ListPagedCatalogItemRequest(int? pageSize, int? pageIndex, int? catalogBrandId, int? catalogTypeId)
    : BaseRequest
{
    public int PageSize { get; init; } = pageSize ?? 0;
    public int PageIndex { get; init; } = pageIndex ?? 0;
    public int? CatalogBrandId { get; init; } = catalogBrandId;
    public int? CatalogTypeId { get; init; } = catalogTypeId;
}