namespace Backend_BD.WebApi.UserManagementEndpoints.Models;

public class GetUserRolesResponse : BaseResponse
{

    public GetUserRolesResponse(Guid correlationId) : base(correlationId)
    {
    }

    public GetUserRolesResponse()
    {
    }

    public List<string> Roles {  get; set; }
}
