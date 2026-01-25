namespace Backend_BD.WebApi.OrderEndpoints;

public class OrderItemDto
{
    public int Id { get; set; }
    public int CatalogItemId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public string PictureUrl { get; set; } = string.Empty;
    public decimal UnitPrice { get; set; }
    public int Units { get; set; }
}