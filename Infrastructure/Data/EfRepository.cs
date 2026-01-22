using Ardalis.Specification.EntityFrameworkCore;
using Backend_BD.AppCore.Interfaces;

namespace Backend_BD.Infrastructure.Data;

public class EfRepository<T>: RepositoryBase<T>, IReadRepository<T>, IRepository<T> where T : class, IAggregateRoot 
{
    public EfRepository(CatalogContext dbContext) : base(dbContext)
    {
    }
}