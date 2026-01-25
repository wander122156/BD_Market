namespace Backend_BD.WebApi.OrderEndpoints;

public class GetOrderByIdResponse : BaseResponse
{
    public GetOrderByIdResponse() { }
    public GetOrderByIdResponse(Guid correlationId) : base(correlationId) { }
    
    public OrderDto? Order { get; set; }
}