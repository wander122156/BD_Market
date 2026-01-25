using Backend_BD.Infrastructure.Identity;
using Backend_BD.Infrastructure.Identity.Constants;
using Backend_BD.WebApi.Extensions;
using Backend_BD.WebApi.UserManagementEndpoints.Models;
using FastEndpoints;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;

namespace Backend_BD.WebApi.UserManagementEndpoints;

public class UserGetByIdEndpoint (UserManager<ApplicationUser> userManager) 
    : Endpoint <GetByIdUserRequest, Results<Ok<GetUserResponse>,NotFound>>
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

    public override async Task<Results<Ok<GetUserResponse>, NotFound>> ExecuteAsync(GetByIdUserRequest request, CancellationToken ct)
    {
        var response = new GetUserResponse(request.CorrelationId());

        var userResponse = await userManager.FindByIdAsync(request.UserId);
        if (userResponse is null)
        {
            return TypedResults.NotFound();
        }
        response.User = userResponse.ToUserDto();
        return TypedResults.Ok(response);
    }
}