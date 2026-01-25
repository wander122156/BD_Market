namespace Backend_BD.WebApi.BasketEndpoints;

public class BasketDto
{
    public int Id { get; set; }
    public string BuyerId { get; set; }
    public List<BasketItemDto> Items { get; set; } = [];
    public decimal Total() => Math.Round(Items.Sum(x => x.UnitPrice * x.Quantity), 2);
}