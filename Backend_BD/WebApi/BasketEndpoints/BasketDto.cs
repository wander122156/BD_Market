namespace Backend_BD.WebApi.BasketEndpoints;

public class BasketDto
{
    public int Id { get; set; }
    public string BuyerId { get; set; }
    public List<BasketItemDto> Items { get; set; } = [];
    public int TotalItems => Items.Sum(i => i.Quantity);
    public decimal Total => Items.Sum(i => i.UnitPrice * i.Quantity);
}