using Ardalis.Specification;

namespace Backend_BD.AppCore.Interfaces;

// IRepositoryBase<T> (из Ardalis.Specification)
// Базовый интерфейс с готовыми методами: AddAsync UpdateAsync DeleteAsync и др.

public interface IRepository<T> : IRepositoryBase<T> where T : class, IAggregateRoot
{
}