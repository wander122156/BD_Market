namespace Backend_BD.WebApi.OrderEndpoints;

public class CreateOrderResponse : BaseResponse
{
    public OrderDto Order { get; set; } = new();
    
    public CreateOrderResponse() : base() { }
    public CreateOrderResponse(Guid correlationId) : base(correlationId) { }
}