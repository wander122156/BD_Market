namespace Backend_BD.WebApi.UserManagementEndpoints;

public class CreateUserResponse : BaseResponse
{
    public CreateUserResponse(Guid correlationId)
    {

    }
    public CreateUserResponse() { }

    public string UserId { get; set; }

}
