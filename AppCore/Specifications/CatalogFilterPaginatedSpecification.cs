using Ardalis.Specification;
using Backend_BD.AppCore.Entities;

namespace Backend_BD.AppCore.Specifications;

public class CatalogFilterPaginatedSpecification : Specification<CatalogItem>
{
    public CatalogFilterPaginatedSpecification(int skip, int take, int? brandId, int? typeId) 
    {
        if (take == 0)
        {
            take = int.MaxValue;
        }
        
        Query
            .Where(i => 
                        (!brandId.HasValue || i.CatalogBrandId == brandId) &&
                        (!typeId.HasValue || i.CatalogTypeId == typeId))
            .Skip(skip).Take(take);
    }
}