using Backend_BD.Interfaces;

namespace Backend_BD.Entities.BasketAggregate;

public class Basket : BaseEntity, IAggregateRoot
{
    public int BuyerId { get ; private set; }
    public List<BasketItem> _items { get; private set; } = [];
    public IReadOnlyCollection<BasketItem> Items => _items.AsReadOnly();
    
    public int TotalItems => _items.Sum(i => i.Quantity);
    
    public Basket(int buyerId)
    {
        BuyerId = buyerId;
    }

    public void AddItem(int catalogItemId, decimal price, int quantity)
    {
        // новый
        if (!_items.Any(i => i.CatalogItemId == catalogItemId))
        {
            _items.Add(new BasketItem(catalogItemId, price, quantity));
            return;
        }
        
        // существующий (ссылка на объект)
        BasketItem existingItem = Items.First(i => i.CatalogItemId == catalogItemId);
        existingItem.AddQuantity(quantity);
    }
    
    public void RemoveEmptyItems()
    {
        _items.RemoveAll(i => i.Quantity == 0);
    }
}