namespace Backend_BD.WebApi.BasketEndpoints;

public class BasketItemDto
{
    public int Id { get; set; }
    public int CatalogItemId { get; set; }
    public decimal UnitPrice { get; set; }
    public int Quantity { get; set; }
}