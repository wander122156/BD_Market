namespace Backend_BD.Infrastructure.Identity.Constants;

public static class AuthorizationConstants
{
    public const string JWT_SECRET_KEY = "your-super-secret-key-min-32-chars-long-for-jwt-signing";
    public const string JWT_ISSUER = "BD_Market";
    public const string JWT_AUDIENCE = "BD_Market";
}
