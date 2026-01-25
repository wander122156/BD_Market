using Backend_BD.AppCore.Entities.OrderAggregate;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Backend_BD.Infrastructure.Data.Config;

public class OrderItemConfiguration : IEntityTypeConfiguration<OrderItem>
{
    public void Configure(EntityTypeBuilder<OrderItem> builder)
    {
        builder.ToTable("OrderItems");
        
        builder.HasKey(oi => oi.Id);
        
        builder.Property(oi => oi.UnitPrice)
            .HasColumnType("decimal(18,2)")
            .IsRequired();
        
        builder.Property(oi => oi.Units)
            .IsRequired();
        
        builder.OwnsOne(oi => oi.ItemOrdered, io =>
        {
            io.Property(i => i.CatalogItemId)
                .IsRequired();
            
            io.Property(i => i.ProductName)
                .IsRequired()
                .HasMaxLength(50);
            
            io.Property(i => i.PictureUri)
                .HasMaxLength(500);
        });
    }
}