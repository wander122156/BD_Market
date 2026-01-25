using Backend_BD.Infrastructure.Identity;
using Backend_BD.Infrastructure.Identity.Constants;
using Backend_BD.WebApi.Extensions;
using Backend_BD.WebApi.UserManagementEndpoints.Models;
using FastEndpoints;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;

namespace Backend_BD.WebApi.UserManagementEndpoints;

public class UserGetByIdEndpoint (UserManager<ApplicationUser> userManager) 
    : Endpoint <GetByIdUserRequest, GetUserResponse>
{
    public override void Configure()
    {
        Get("api/users/{userId}");
        Roles(AuthorizationConstants.Roles.ADMINISTRATORS);
        AuthSchemes(JwtBearerDefaults.AuthenticationScheme);
        Description(d =>
            d.Produces<GetUserResponse>()
                .WithTags("UserManagementEndpoints"));
    }

    public override async Task HandleAsync(GetByIdUserRequest request, CancellationToken ct)
    {
        var response = new GetUserResponse(request.CorrelationId());

        var userResponse = await userManager.FindByIdAsync(request.UserId);
        if (userResponse is null)
        {
           await Send.NotFoundAsync(ct);
           return;
        }
        response.User = userResponse.ToUserDto();
        
        await Send.OkAsync(response, ct);
    }
}