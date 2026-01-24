namespace Backend_BD.WebApi.BasketEndpoints;

public class AddToBasketResponse : BaseResponse
{
    public AddToBasketResponse(Guid correlationId) : base(correlationId)
    {
    }

    public AddToBasketResponse()
    {
    }

    public BasketDto Basket { get; set; } =  new();
}