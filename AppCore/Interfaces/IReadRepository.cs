using Ardalis.Specification;

namespace Backend_BD.AppCore.Interfaces;

public interface IReadRepository<T> : IReadRepositoryBase<T> where T : class, IAggregateRoot
{
    
}