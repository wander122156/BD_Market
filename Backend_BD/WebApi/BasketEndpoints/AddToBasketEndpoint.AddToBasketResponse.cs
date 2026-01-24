namespace Backend_BD.WebApi.BasketEndpoints;

public class AddToBasketResponse : BaseResponse
{
    public AddToBasketResponse(Guid correlationId) : base(correlationId)
    {}
    
    public AddToBasketResponse()
    {}
    
    public int BasketId { get; set; }
    public int TotalItems { get; set; }
    public decimal Total { get; set; }
}