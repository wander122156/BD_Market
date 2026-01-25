using System.Security.Claims;
using Backend_BD.AppCore.Interfaces;
using Backend_BD.Infrastructure.Identity;
using FastEndpoints;
using Microsoft.AspNetCore.Identity;

namespace Backend_BD.WebApi.AuthEndpoints;

public class AuthenticateEndpoint(
    SignInManager<ApplicationUser> signInManager,
    ITokenClaimsService tokenClaimsService,
    ILogger<AuthenticateEndpoint> logger
)
    : Endpoint<AuthenticateRequest, AuthenticateResponse>
{
    public override void Configure()
    {
        Post("/api/auth/login");
        AllowAnonymous();
        Description(d =>
            d.WithSummary("Authenticates a user")
                .WithDescription("Authenticates a user")
                .WithName("auth.authenticate")
                .WithTags("AuthEndpoints"));
    }

    public override async Task HandleAsync(AuthenticateRequest req, CancellationToken ct)
    {
        var response = new AuthenticateResponse(req.CorrelationId());

        logger.LogInformation("Authenticating {Username}. CorrelationId: {CorrelationId}",
            req.Username, response.CorrelationId);

        if (string.IsNullOrWhiteSpace(req.Username))
        {
            logger.LogWarning("Empty username received. CorrelationId: {CorrelationId}", 
                response.CorrelationId);
        
            response.Result = false;
            response.Username = "";
            await Send.ErrorsAsync(400, ct);
            return;
        }
        
        var result = await signInManager.PasswordSignInAsync(
            req.Username, req.Password, false, lockoutOnFailure: true);

        response.Result = result.Succeeded;
        response.IsLockedOut = result.IsLockedOut;
        response.IsNotAllowed = result.IsNotAllowed;
        response.RequiresTwoFactor = result.RequiresTwoFactor;
        response.Username = req.Username;   

        if (result.Succeeded)
        {
            response.Token = await tokenClaimsService.GetTokenAsync(req.Username);
                
            response.UserInfo = new UserInfo
            {
                IsAuthenticated = true,
                Claims = new List<ClaimValue>
                {
                    new(ClaimTypes.NameIdentifier, req.Username),
                    new(ClaimTypes.Name, req.Username)
                }
            };
        }

        await Send.OkAsync(response, ct);
    }
}