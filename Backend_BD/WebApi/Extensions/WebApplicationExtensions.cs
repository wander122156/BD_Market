using Backend_BD.Infrastructure.Data;

namespace Backend_BD.WebApi.Extensions;

public static class WebApplicationExtensions
{
    // После добавления this можно вызывать: app.SeedDatabaseAsync() вместо WebApplicationExtensions.SeedDatabaseAsync(app);
    public static async Task SeedDatabaseAsync(this WebApplication app) 
    {
        app.Logger.LogInformation("Seeding Database...");
        
        using IServiceScope scope = app.Services.CreateScope();
        IServiceProvider scopedProvider = scope.ServiceProvider;
        try
        {
            CatalogContext catalogContext = scopedProvider.GetRequiredService<CatalogContext>();
            await CatalogContextSeed.SeedAsync(catalogContext, app.Logger);
        }
        catch (Exception ex)
        {
            app.Logger.LogError(ex, "An error occurred seeding the DB.");
        }
    }
}