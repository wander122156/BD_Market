using Backend_BD.Interfaces;

namespace Backend_BD.Entities;

public class CatalogItem : BaseEntity, IAggregateRoot
{
    public string Name { get; private set; }
    public string Description { get; private set; }
    public decimal Price { get; private set; }
    public string PictureUri { get; private set; }
    public int CatalogTypeId { get; private set; }
    public CatalogType? CatalogType { get; private set; }
    public int CatalogBrandId { get; private set; }
    public CatalogBrand? CatalogBrand { get; private set; }
    
    public CatalogItem(int catalogTypeId,
        int catalogBrandId,
        string description,
        string name,
        decimal price,
        string pictureUri)
    {
        CatalogTypeId = catalogTypeId;
        CatalogBrandId = catalogBrandId;
        Description = description;
        Name = name;
        Price = price;
        PictureUri = pictureUri;
    }

    public void UpdateDetails(CatalogItemDetails details)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(details.Name, nameof(details.Name));
        ArgumentException.ThrowIfNullOrWhiteSpace(details.Description, nameof(details.Description));
        ArgumentOutOfRangeException.ThrowIfNegativeOrZero(details.Price, nameof(details.Price));
        
        Name = details.Name;
        Description = details.Description;
        Price = details.Price;
    }
    
    public void UpdateBrand(int catalogBrandId)
    {
        ArgumentOutOfRangeException.ThrowIfNegativeOrZero(catalogBrandId, nameof(catalogBrandId));
        CatalogBrandId = catalogBrandId;
    }

    public void UpdateType(int catalogTypeId)
    {
        ArgumentOutOfRangeException.ThrowIfNegativeOrZero(catalogTypeId, nameof(catalogTypeId));
        CatalogTypeId = catalogTypeId;
    }

    public void UpdatePictureUri(string pictureName)
    {
        if (string.IsNullOrEmpty(pictureName))
        {
            PictureUri = string.Empty;
            return;
        }
        PictureUri = $"images\\products\\{pictureName}?{new DateTime().Ticks}";
    }
    
    public readonly record struct CatalogItemDetails(string? Name, string? Description, decimal Price)
    {
        public string? Name { get; } = Name;
        public string? Description { get; } = Description;
        public decimal Price { get; } = Price;
    }
}