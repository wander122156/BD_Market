using Backend_BD.AppCore.Entities.OrderAggregate;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Backend_BD.Infrastructure.Data.Config;

public class OrderConfiguration : IEntityTypeConfiguration<Order>
{
    public void Configure(EntityTypeBuilder<Order> builder)
    {
        builder.ToTable("Orders");
        
        builder.HasKey(o => o.Id);
        
        builder.Property(o => o.BuyerId)
            .IsRequired()
            .HasMaxLength(256);
        
        builder.Property(o => o.OrderDate)
            .IsRequired();
        
        // Address как встроенный объект (Owned Entity)
        builder.OwnsOne(o => o.ShipToAddress, address =>
        {
            address.Property(a => a.Street)
                .HasMaxLength(180)
                .IsRequired();
            
            address.Property(a => a.City)
                .HasMaxLength(100)
                .IsRequired();
            
            address.Property(a => a.State)
                .HasMaxLength(60);
            
            address.Property(a => a.Country)
                .HasMaxLength(90)
                .IsRequired();
            
            address.Property(a => a.ZipCode)
                .HasMaxLength(18)
                .IsRequired();
        });
        
        builder.HasMany(o => o.OrderItems)
            .WithOne()
            .OnDelete(DeleteBehavior.Cascade);
    }
}