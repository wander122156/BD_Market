using System.Reflection;
using Backend_BD.AppCore.Entities;
using Backend_BD.AppCore.Entities.BasketAggregate;
using Backend_BD.AppCore.Entities.OrderAggregate;
using Microsoft.EntityFrameworkCore;

namespace Backend_BD.Infrastructure.Data;

public class CatalogContext : DbContext
{
    public DbSet<Basket> Baskets { get; set; }
    public DbSet<CatalogItem> CatalogItems { get; set; }
    public DbSet<CatalogBrand> CatalogBrands { get; set; }
    public DbSet<CatalogType> CatalogTypes { get; set; }
    
    public DbSet<Order> Orders { get; set; }
    public DbSet<OrderItem> OrderItems { get; set; }
    
    #pragma warning disable CS8618 // Required by Entity Framework
    public CatalogContext(DbContextOptions<CatalogContext> options) : base(options) {}
    
    // Вызывается один раз при запуске приложения для построения модели БД
    // загружает настройки из файлов конфигурации
    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
        builder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
    }
}