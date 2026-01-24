namespace Backend_BD.AppCore.Entities;

// DRY (Don't Repeat Yourself)
// Одинаковый парамерт для всех сущностей
public abstract class BaseEntity
{
    public virtual int Id { get; protected set; }         
}