namespace Backend_BD.WebApi.BasketEndpoints;

public class UpdateBasketItemRequest : BaseRequest
{
    public int BasketItemId { get; set; }
    public int Quantity { get; set; }
}