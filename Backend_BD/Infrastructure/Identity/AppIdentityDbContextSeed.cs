using Backend_BD.Infrastructure.Identity.Constants;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Backend_BD.Infrastructure.Identity;

public class AppIdentityDbContextSeed
{
    public static async Task SeedAsync(AppIdentityDbContext identityDbContext, UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager)
    {

        await identityDbContext.Database.MigrateAsync();

        await roleManager.CreateAsync(new IdentityRole(AuthorizationConstants.Roles.ADMINISTRATORS));
        await roleManager.CreateAsync(new IdentityRole(AuthorizationConstants.Roles.MANAGERS));

        var defaultUser = new ApplicationUser 
        { 
            UserName = "demouser@bdmarket.com", 
            Email = "demouser@bdmarket.com" 
        };
        await userManager.CreateAsync(defaultUser, AuthorizationConstants.DEFAULT_PASSWORD);

        var productManager = new ApplicationUser 
        { 
            UserName = "manager@bdmarket.com", 
            Email = "manager@bdmarket.com" 
        };
        await userManager.CreateAsync(productManager, AuthorizationConstants.DEFAULT_PASSWORD);
        
        productManager = await userManager.FindByNameAsync(productManager.UserName);
        if (productManager != null)
        {
            await userManager.AddToRoleAsync(productManager, AuthorizationConstants.Roles.MANAGERS);
        }

        string adminUserName = "admin@bdmarket.com";
        var adminUser = new ApplicationUser 
        { 
            UserName = adminUserName, 
            Email = adminUserName 
        };
        await userManager.CreateAsync(adminUser, AuthorizationConstants.DEFAULT_PASSWORD);
        
        adminUser = await userManager.FindByNameAsync(adminUserName);
        if (adminUser != null)
        {
            await userManager.AddToRoleAsync(adminUser, AuthorizationConstants.Roles.ADMINISTRATORS);
        }
    }
}
