namespace Backend_BD.WebApi.BasketEndpoints;

public class UpdateBasketItemResponse: BaseResponse
{
    public UpdateBasketItemResponse(Guid correlationId) : base(correlationId)
    { }
    
    public UpdateBasketItemResponse()
    { }
    public BasketDto Basket { get; set; } = new();
}