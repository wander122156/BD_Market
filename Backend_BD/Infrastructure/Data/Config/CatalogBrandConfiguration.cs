using Backend_BD.AppCore.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Backend_BD.Infrastructure.Data.Config;

public class CatalogBrandConfiguration : IEntityTypeConfiguration<CatalogBrand>
{
    public void Configure(EntityTypeBuilder<CatalogBrand> builder)
    {
        builder.ToTable("CatalogBrands");
        
        builder.HasKey(cb => cb.Id);

        builder.Property(cb => cb.Id)
            .ValueGeneratedOnAdd();

        builder.Property(cb => cb.Brand)
            .IsRequired()
            .HasMaxLength(100);
    }
}
