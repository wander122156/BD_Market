namespace Backend_BD.WebApi.BasketEndpoints;

public class AddToBasketRequest: BaseRequest
{
    public int CatalogItemId { get; set; }
    public decimal Price { get; set; }
    public int Quantity { get; set; } = 1;
}