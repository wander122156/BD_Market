using Backend_BD.AppCore.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Backend_BD.Infrastructure.Data.Config;

public class CatalogTypeConfiguration : IEntityTypeConfiguration<CatalogType>
{
    public void Configure(EntityTypeBuilder<CatalogType> builder)
    {
        builder.ToTable("CatalogTypes");
        
        builder.HasKey(ct => ct.Id);

        builder.Property(ct => ct.Id)
            .ValueGeneratedOnAdd();

        builder.Property(ct => ct.Type)
            .IsRequired()
            .HasMaxLength(100);
    }
}
