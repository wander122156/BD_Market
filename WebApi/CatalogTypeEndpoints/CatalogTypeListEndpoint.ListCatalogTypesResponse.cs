namespace Backend_BD.WebApi.CatalogTypeEndpoints;

public class ListCatalogTypesResponse : BaseResponse
{
    public ListCatalogTypesResponse(Guid correlationId) : base(correlationId)
    {}
    
    public ListCatalogTypesResponse()
    {}

    public List<CatalogTypeDto> CatalogTypes { get; set; } = [];
}