namespace Backend_BD.WebApi.OrderEndpoints;

public class ListOrdersResponse : BaseResponse
{
    public ListOrdersResponse(Guid correlationId): base(correlationId) 
    {}
    
    public ListOrdersResponse()
    {}
    
    public List<OrderDto> Orders { get; set; } = [];
}