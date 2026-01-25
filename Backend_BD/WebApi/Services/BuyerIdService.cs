using System.Security.Claims;

namespace Backend_BD.WebApi.Services;

public class BuyerIdService : IBuyerIdService
{
    private const string BasketCookieName = "bdMarket";
    
    public string GetBuyerId(HttpContext httpContext, ClaimsPrincipal user)
    {
        // пользователь авторизован - возвращаем его email/username
        if (user.Identity?.IsAuthenticated == true)
        {
            return user.Identity.Name;
        }
        
        // нет - пытаемся получить из cookie
        var cookieValue = httpContext.Request.Cookies[BasketCookieName];
        if (!string.IsNullOrEmpty(cookieValue))
        {
            return cookieValue;
        }
        
        // cookie нет - создаём новую
        var newBuyerId = Guid.NewGuid().ToString();
        httpContext.Response.Cookies.Append(BasketCookieName, newBuyerId, 
            new CookieOptions 
            { 
                HttpOnly = true,
                SameSite = SameSiteMode.Strict,
                Expires = DateTime.UtcNow.AddYears(10)
            });
        
        return newBuyerId;
    }
    
    public void ClearAnonymousCookie(HttpContext httpContext)
    {
        httpContext.Response.Cookies.Delete(BasketCookieName);
    }
}