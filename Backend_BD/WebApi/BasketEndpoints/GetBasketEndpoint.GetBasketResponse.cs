namespace Backend_BD.WebApi.BasketEndpoints;

public class GetBasketResponse : BaseResponse
{
    public int BasketId { get; set; }
    public string BuyerId { get; set; }
    public List<BasketItemDto> Items { get; set; } = [];
    public decimal Total => Math.Round(Items.Sum(i => i.UnitPrice * i.Quantity), 2);
}