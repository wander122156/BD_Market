using Backend_BD.AppCore.Entities.BasketAggregate;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Backend_BD.Infrastructure.Data.Config;

public class BasketItemConfiguration : IEntityTypeConfiguration<BasketItem>
{
    public void Configure(EntityTypeBuilder<BasketItem> builder)
    {
        builder.ToTable("BasketItems");
        
        builder.HasKey(bi => bi.Id);

        builder.Property(bi => bi.Id)
            .ValueGeneratedOnAdd();

        builder.Property(bi => bi.BasketId)
            .IsRequired();

        builder.Property(bi => bi.CatalogItemId)
            .IsRequired();

        builder.Property(bi => bi.Quantity)
            .IsRequired();

        builder.Property(bi => bi.UnitPrice)
            .IsRequired()
            .HasColumnType("numeric(18,2)");
    }
}