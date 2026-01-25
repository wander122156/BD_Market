namespace Backend_BD.WebApi.UserManagementEndpoints;

public class CreateUserDto
{
    public string Id { get; set; } = string.Empty; 
    public string UserName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public bool EmailConfirmed { get; set; } = false;
    public string PhoneNumber { get; set; } = string.Empty;
    public bool PhoneNumberConfirmed { get; set; } = false;
    public bool TwoFactorEnabled { get; set; } = false;
    public DateTimeOffset? LockoutEnd { get; set; }
    public string Password { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;
}