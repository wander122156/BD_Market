using Ardalis.Specification;
using Backend_BD.AppCore.Entities;

namespace Backend_BD.AppCore.Specifications;

public class CatalogFilterSpecification : Specification<CatalogItem>
{
    public CatalogFilterSpecification(int? brandId, int? typeId)
    {
        Query.Where(i => 
                         (!brandId.HasValue || i.CatalogBrandId == brandId) &&
                         (!typeId.HasValue || i.CatalogTypeId == typeId));
    }
}