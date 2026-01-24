using Backend_BD.AppCore;
using Backend_BD.AppCore.Interfaces;
using Backend_BD.AppCore.Services;
using Backend_BD.Infrastructure.Data;
using Backend_BD.Infrastructure.Logging;
using Backend_BD.WebApi.Extensions;
using FastEndpoints;
using FastEndpoints.Swagger;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddFastEndpoints();

builder.Services.AddDbContext<CatalogContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("CatalogContext"))
);
 
// DI, Когда кто-то попросит IRepository<T>, создай и дай ему EfRepository<T>
builder.Services.AddScoped(typeof(IRepository<>), typeof(EfRepository<>));
builder.Services.AddScoped<IBasketService, BasketService>();
builder.Services.AddScoped(typeof(IAppLogger<>), typeof(LoggerAdapter<>));

var catalogSettings = builder.Configuration.Get<CatalogSettings>() ?? new CatalogSettings();
builder.Services.AddSingleton<IUriComposer>(new UriComposer(catalogSettings));

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        // В Development разрешаем любой origin (в т.ч. другой порт Vite, IP и т.п.)
        if (builder.Environment.IsDevelopment())
        {
            policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod();
        }
        else
        {
            policy.WithOrigins("http://localhost:5173", "http://127.0.0.1:5173")
                .AllowAnyHeader()
                .AllowAnyMethod();
        }
    });
});

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

app.UseCors();
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