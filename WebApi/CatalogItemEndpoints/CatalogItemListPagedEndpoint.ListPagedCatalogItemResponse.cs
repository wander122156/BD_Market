namespace Backend_BD.WebApi.CatalogItemEndpoints;

public class ListPagedCatalogItemResponse : BaseResponse
{
    public ListPagedCatalogItemResponse(Guid correlationId) : base(correlationId)
    { }
    
    public ListPagedCatalogItemResponse()
    { }

    public List<CatalogItemDto> CatalogItems { get; set; } = [];
    
    public int PageCount { get; set; }
}