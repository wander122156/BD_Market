namespace Backend_BD.WebApi.CatalogBrandEndpoints;

public class ListCatalogBrandsResponse : BaseResponse
{
    public  ListCatalogBrandsResponse(Guid correlationId) : base(correlationId)
    {}
    
    public  ListCatalogBrandsResponse()
    {}

    public List<CatalogBrandDto> CatalogBrands { get; set; } = [];
}