namespace Backend_BD.WebApi.BasketEndpoints;

public class DeleteBasketItemResponse : BaseResponse
{
    public BasketDto Basket { get; set; } = new();
    
    public DeleteBasketItemResponse() : base() { }
    public DeleteBasketItemResponse(Guid correlationId) : base(correlationId) { }
}