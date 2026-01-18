namespace Backend_BD.Entities.OrderAggregate;

// Товар в каталоге может поменяться, поэтмоу делается и хранится снимок в OrderItem, а не ссылка
public class CatalogItemOrdered // снимок Объект-значение (не сущность), можно сравнивать
{
    public int CatalogItemId { get; private set; }
    public string ProductName { get; private set; }
    public string PictureUri { get; private set; }
    
    #pragma warning disable CS8618 // Required by Entity Framework
    public CatalogItemOrdered()
    {}

    public CatalogItemOrdered(int catalogItemId, string productName, string pictureUri)
    {
        ArgumentOutOfRangeException.ThrowIfLessThan(catalogItemId, 1, nameof(catalogItemId));
        ArgumentException.ThrowIfNullOrWhiteSpace(productName, nameof(productName));
        ArgumentException.ThrowIfNullOrWhiteSpace(pictureUri, nameof(pictureUri));
        
        CatalogItemId = catalogItemId;
        ProductName = productName;
        PictureUri = pictureUri;
    }
}