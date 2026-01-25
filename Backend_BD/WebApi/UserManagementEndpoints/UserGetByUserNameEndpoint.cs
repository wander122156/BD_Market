using Backend_BD.Infrastructure.Identity;
using Backend_BD.Infrastructure.Identity.Constants;
using Backend_BD.WebApi.Extensions;
using Backend_BD.WebApi.UserManagementEndpoints.Models;
using FastEndpoints;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;

namespace Backend_BD.WebApi.UserManagementEndpoints;

public class UserGetByUserNameEndpoint (UserManager<ApplicationUser> userManager) : Endpoint <GetByUserNameUserRequest, GetUserResponse>
{
    public override void Configure()
    {
        Get("api/users/name/{userName}");
        Roles(AuthorizationConstants.Roles.ADMINISTRATORS);
        AuthSchemes(JwtBearerDefaults.AuthenticationScheme);
        Description(d =>
            d.Produces<GetUserResponse>()
            .WithTags("UserManagementEndpoints"));
    }

    public override async Task HandleAsync(GetByUserNameUserRequest request, CancellationToken ct)
    {
        var response = new GetUserResponse(request.CorrelationId());

        var userResponse = await userManager.FindByNameAsync(request.UserName);
        if (userResponse is null)
        {
            await Send.NotFoundAsync(ct);
            return;
        }
        response.User = userResponse.ToUserDto();
        await Send.OkAsync(response, ct);
    }
}
