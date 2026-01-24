namespace Backend_BD.AppCore.Interfaces;

public interface IBasketQueryService
{
    Task<int> CountTotalBasketItems(string username);
}