namespace Backend_BD.WebApi.BasketEndpoints;

public class BasketItemDto
{
    public int Id { get; set; }
    public int CatalogItemId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public decimal UnitPrice { get; set; }
    public decimal OldUnitPrice { get; set; }
    public int Quantity { get; set; }
    public string PictureUrl { get; set; } = string.Empty;
}