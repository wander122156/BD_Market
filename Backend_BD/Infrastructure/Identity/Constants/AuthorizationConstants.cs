namespace Backend_BD.Infrastructure.Identity.Constants;

public static class AuthorizationConstants
{
    public const string JWT_SECRET_KEY = "your-super-secret-key-min-32-chars-long-for-jwt-signing";
    public const string DEFAULT_PASSWORD = "Pass@word1";
    public const string JWT_ISSUER = "BD_Market";
    public const string JWT_AUDIENCE = "BD_Market";

    public static class Roles
    {
        public const string ADMINISTRATORS = "Administrators";
        public const string MANAGERS = "Managers";
    }
}