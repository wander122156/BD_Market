using Backend_BD.Interfaces;

namespace Backend_BD.Entities.BuyerAggregate;

public class Buyer : BaseEntity, IAggregateRoot
{
    // связывает доменную сущность Buyer с аккаунтом пользователя в системе аутентификации
    public string IdentityGuid { get; private set; }
    
    private List<PaymentMethod> _paymentMethods = [];
    
    public IEnumerable<PaymentMethod> PaymentMethods => _paymentMethods.AsReadOnly();
    
    // EF Core нужен конструктор без параметров для создания объекта при загрузке из базы данных
    #pragma warning disable CS8618 // Required by Entity Framework
    private Buyer() { }

    public Buyer(string identity) : this()
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(identity);
        IdentityGuid = identity;
    }
}