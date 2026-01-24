using Backend_BD.AppCore.Entities.BasketAggregate;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Backend_BD.Infrastructure.Data.Config;

public class BasketConfiguration: IEntityTypeConfiguration<Basket>
{
    public void Configure(EntityTypeBuilder<Basket> builder)
    {
        builder.ToTable("Baskets");
        
        builder.HasKey(b => b.Id);

        builder.Property(b => b.Id)
            .ValueGeneratedOnAdd();

        builder.Property(b => b.BuyerId)
            .IsRequired()
            .HasMaxLength(256);

        builder.HasMany(b => b.Items)
            .WithOne()
            .HasForeignKey(bi => bi.BasketId)
            .OnDelete(DeleteBehavior.Cascade);

        var navigation = builder.Metadata.FindNavigation(nameof(Basket.Items));
        navigation?.SetPropertyAccessMode(PropertyAccessMode.Field);
    }
}