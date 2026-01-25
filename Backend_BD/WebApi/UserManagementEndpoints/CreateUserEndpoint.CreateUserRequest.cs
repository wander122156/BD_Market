namespace Backend_BD.WebApi.UserManagementEndpoints;

public class CreateUserRequest : BaseRequest
{
    public UserDto User { get; set; }
}
