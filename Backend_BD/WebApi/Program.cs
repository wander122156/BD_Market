using System.Security.Claims;
using System.Text;
using Backend_BD.AppCore;
using Backend_BD.AppCore.Interfaces;
using Backend_BD.AppCore.Services;
using Backend_BD.Infrastructure.Data;
using Backend_BD.Infrastructure.Identity;
using Backend_BD.Infrastructure.Identity.Constants;
using Backend_BD.Infrastructure.Logging;
using Backend_BD.WebApi.Extensions;
using Backend_BD.WebApi.Services;
using FastEndpoints;
using FastEndpoints.Swagger;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddFastEndpoints();

builder.Services.AddDbContext<CatalogContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("CatalogContext"))
);

builder.Services.AddDbContext<AppIdentityDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("CatalogContext")));


builder.Services.AddIdentity<ApplicationUser, IdentityRole>(options =>
    {
        options.SignIn.RequireConfirmedAccount = false;
        options.Password.RequireDigit = true;
        options.Password.RequiredLength = 6;
        options.Password.RequireNonAlphanumeric = false;
        options.Password.RequireUppercase = true;
        options.Password.RequireLowercase = true;
        options.User.RequireUniqueEmail = true;
        options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(15);
        options.Lockout.MaxFailedAccessAttempts = 5;
    }).AddEntityFrameworkStores<AppIdentityDbContext>()
    .AddDefaultTokenProviders();

builder.Services.AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(AuthorizationConstants.JWT_SECRET_KEY)),
        
            ValidateIssuer = false,  
            ValidateAudience = false, 
        
            ValidateLifetime = true,
            ClockSkew = TimeSpan.Zero,
        
            RequireExpirationTime = true,
        
            NameClaimType = ClaimTypes.Name,
            RoleClaimType = ClaimTypes.Role
        };
    
        options.Events = new JwtBearerEvents
        {
            OnAuthenticationFailed = context =>
            {
                Console.WriteLine($"JWT Authentication Failed: {context.Exception.Message}");
                return Task.CompletedTask;
            },
            OnTokenValidated = context =>
            {
                Console.WriteLine($"JWT Token Validated for user: {context.Principal?.Identity?.Name}");
                return Task.CompletedTask;
            }
        };
    });
    
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AdminOnly", policy => 
        policy.RequireRole(AuthorizationConstants.Roles.ADMINISTRATORS));
    
    // Политика для менеджеров и администраторов
    options.AddPolicy("ManagerOrAdmin", policy =>
        policy.RequireRole(
            AuthorizationConstants.Roles.ADMINISTRATORS,
            AuthorizationConstants.Roles.MANAGERS));
    
    // Политика для зарегистрированных пользователей
    options.AddPolicy("AuthenticatedUser", policy =>
        policy.RequireAuthenticatedUser());
    
    options.AddPolicy("CanManageProducts", policy =>
        policy.RequireAssertion(context =>
            context.User.IsInRole(AuthorizationConstants.Roles.ADMINISTRATORS) ||
            context.User.IsInRole(AuthorizationConstants.Roles.MANAGERS) ));
    
    options.AddPolicy("CanPurchase", policy =>
        policy.RequireAssertion(context =>
            context.User.IsInRole(AuthorizationConstants.Roles.ADMINISTRATORS) ||
            context.User.IsInRole(AuthorizationConstants.Roles.MANAGERS) ));
});

// DI, Когда кто-то попросит IRepository<T>, создай и дай ему EfRepository<T>
builder.Services.AddScoped(typeof(IRepository<>), typeof(EfRepository<>));
builder.Services.AddScoped<IBasketService, BasketService>();
builder.Services.AddScoped(typeof(IAppLogger<>), typeof(LoggerAdapter<>));
builder.Services.AddScoped<IBasketViewModelService, BasketViewModelService>();
builder.Services.AddScoped<IOrderService, OrderService>();
builder.Services.AddScoped<ITokenClaimsService, IdentityTokenClaimService>();
builder.Services.AddScoped<IBuyerIdService, BuyerIdService>();

var catalogSettings = builder.Configuration.Get<CatalogSettings>() ?? new CatalogSettings();
builder.Services.AddSingleton<IUriComposer>(new UriComposer(catalogSettings));

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(
                "http://localhost:5173",
                "http://127.0.0.1:5173",
                "http://localhost:5064",
                "https://localhost:5064"
            )
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials();
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
    
    o.EnableJWTBearerAuth = true; //авторизация в Swagger
    o.AutoTagPathSegmentIndex = 1;
}); 

var app = builder.Build();

app.UseCors("AllowFrontend");

app.UseStaticFiles(); 
await app.SeedDatabaseAsync(); // Заполнение базы

app.UseFastEndpoints();

app.UseSwaggerGen();

app.UseAuthentication();
app.UseAuthorization(); 

using (var scope = app.Services.CreateScope())
{
    try
    {
        var identityContext = scope.ServiceProvider.GetRequiredService<AppIdentityDbContext>();
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();
        var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
        
        await AppIdentityDbContextSeed.SeedAsync(identityContext, userManager, roleManager);
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Identity seed failed: {ex.Message}");
    }
}

app.MapGet("/", () => new
{
    Service = "4 соприкосновение человека с API",
    Status = "Running",
});

app.Run();