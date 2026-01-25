namespace Backend_BD.WebApi.OrderEndpoints;

public class OrderDto
{
    public int Id { get; set; }
    public string BuyerId { get; set; } = string.Empty;
    public DateTimeOffset OrderDate { get; set; }
    public AddressDto ShipToAddress { get; set; } = new();
    public List<OrderItemDto> Items { get; set; } = new();
    public decimal Total { get; set; }
}