using Backend_BD.AppCore;
using Backend_BD.AppCore.Interfaces;
using Backend_BD.AppCore.Services;
using Backend_BD.Infrastructure.Data;
using Backend_BD.WebApi.Extensions;
using FastEndpoints;
using FastEndpoints.Swagger;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddFastEndpoints();

builder.Services.AddDbContext<CatalogContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("CatalogContext"))
);
 
// DI, Когда кто-то попросит IRepository<T>, создай и дай ему EfRepository<T>
builder.Services.AddScoped(typeof(IRepository<>), typeof(EfRepository<>));

var catalogSettings = builder.Configuration.Get<CatalogSettings>() ?? new CatalogSettings();
builder.Services.AddSingleton<IUriComposer>(new UriComposer(catalogSettings));

builder.Services.SwaggerDocument(o =>
{
    o.DocumentSettings = s =>
    {
        s.Title = "Backend BD Market API";
        s.Version = "v1";
        s.Description = "API for Backend BD Market";
    };
}); 

var app = builder.Build();

app.UseStaticFiles(); 
await app.SeedDatabaseAsync(); // Заполнение базы

app.UseFastEndpoints();

app.UseSwaggerGen();

// app.UseAuthorization();

app.MapGet("/", () => new
{
    Service = "4 соприкосновение человека с API",
    Status = "Running",
});

app.Run();