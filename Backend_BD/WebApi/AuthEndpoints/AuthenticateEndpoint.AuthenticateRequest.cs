namespace Backend_BD.WebApi.AuthEndpoints;

public class AuthenticateRequest : BaseRequest
{
    public string Username { get; set; }
    public string Password { get; set; }
}
