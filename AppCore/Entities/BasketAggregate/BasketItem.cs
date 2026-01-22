namespace Backend_BD.AppCore.Entities.BasketAggregate;

public class BasketItem : BaseEntity
{
    public decimal UnitPrice { get; private set; }
    public int Quantity { get; private set; }
    public int CatalogItemId { get; private set; }
    public int BasketId { get; private set; }

    public BasketItem(int catalogItemId, decimal unitPrice, int quantity)
    {
        CatalogItemId = catalogItemId;
        UnitPrice = unitPrice;
        SetQuantity(quantity);
    }
    public void SetQuantity(int quantity)
    {
        if (quantity < 0)
        {
            throw new ArgumentOutOfRangeException(nameof(quantity), 
                "Quantity cannot be negative");
        }
    
        Quantity = quantity;
    }

    public void AddQuantity(int quantity)
    {
        if (quantity < 0)
        {
            throw new ArgumentOutOfRangeException(nameof(quantity),
                "Quantity cannot be negative");
        }
        
        Quantity += quantity;
    }
}