using Backend_BD.AppCore.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Backend_BD.Infrastructure.Data.Config;

public class CatalogItemConfiguration : IEntityTypeConfiguration<CatalogItem>
{
    public void Configure(EntityTypeBuilder<CatalogItem> builder)
    {
        builder.ToTable("Catalog");

        builder.HasKey(ci => ci.Id);

        builder.Property(ci => ci.Id)
            .ValueGeneratedOnAdd();

        builder.Property(ci => ci.Name)
            .IsRequired()
            .HasMaxLength(50);

        builder.Property(ci => ci.Description)
            .IsRequired();

        builder.Property(ci => ci.Price)
            .IsRequired()
            .HasColumnType("numeric(18,2)");

        builder.Property(ci => ci.PictureUri)
            .IsRequired(false);

        builder.HasOne(ci => ci.CatalogBrand)
            .WithMany()
            .HasForeignKey(ci => ci.CatalogBrandId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(ci => ci.CatalogType)
            .WithMany()
            .HasForeignKey(ci => ci.CatalogTypeId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
