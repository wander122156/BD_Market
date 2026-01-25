using Backend_BD.Infrastructure.Identity;
using Backend_BD.Infrastructure.Identity.Constants;
using Backend_BD.WebApi.Extensions;
using FastEndpoints;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;

namespace Backend_BD.WebApi.UserManagementEndpoints;

public class CreateUserEndpoint(UserManager<ApplicationUser> userManager) 
    : Endpoint<CreateUserRequest, CreateUserResponse>
{
    public override void Configure()
    {
        Post("api/users");
        AllowAnonymous();
        // Roles(AuthorizationConstants.Roles.ADMINISTRATORS);
        AuthSchemes(JwtBearerDefaults.AuthenticationScheme);
        Description(d =>
            d.Produces<CreateUserResponse>()
            .WithTags("UserManagementEndpoints")
        );
    }

    public override async Task HandleAsync(CreateUserRequest request, CancellationToken ct)
    {
        var response = new CreateUserResponse(request.CorrelationId());
        if (request is null || request.User is null || request.User.UserName is null)
        {
            await Send.ErrorsAsync(400, ct);
            return;
        }
        var existingUser = await userManager.FindByNameAsync(request.User.UserName);
        if (existingUser != null) {
            throw new DuplicateException($"User already exists.");
        };

        ApplicationUser newUser = new();
        newUser.FromUserDto(request.User, copyId: false);

        var createUser = await userManager.CreateAsync(newUser);
        if (createUser.Succeeded)
        {
            var createdUser = await userManager.FindByNameAsync(request.User.UserName);
            await userManager.AddPasswordAsync(createdUser!, AuthorizationConstants.DEFAULT_PASSWORD);
            response.UserId = createdUser!.Id;
            await Send.CreatedAtAsync<UserGetByIdEndpoint>(new { UserId = createdUser!.Id }, response, cancellation: ct);
        }
    }
    
    public class DuplicateException : Exception
    {
        public DuplicateException(string message) : base(message)
        {

        }

    }
}
