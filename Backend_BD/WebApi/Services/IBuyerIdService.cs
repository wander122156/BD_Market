using System.Security.Claims;

namespace Backend_BD.WebApi.Services;

public interface IBuyerIdService
{
    string GetBuyerId(HttpContext httpContext, ClaimsPrincipal user);
    void ClearAnonymousCookie(HttpContext httpContext);
}