using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Backend_BD.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddOrdersAndBaskets : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Orders",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    BuyerId = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: false),
                    OrderDate = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    ShipToAddress_Street = table.Column<string>(type: "character varying(180)", maxLength: 180, nullable: false),
                    ShipToAddress_City = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    ShipToAddress_State = table.Column<string>(type: "character varying(60)", maxLength: 60, nullable: false),
                    ShipToAddress_Country = table.Column<string>(type: "character varying(90)", maxLength: 90, nullable: false),
                    ShipToAddress_ZipCode = table.Column<string>(type: "character varying(18)", maxLength: 18, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Orders", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "OrderItems",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ItemOrdered_CatalogItemId = table.Column<int>(type: "integer", nullable: false),
                    ItemOrdered_ProductName = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    ItemOrdered_PictureUri = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    UnitPrice = table.Column<decimal>(type: "numeric(18,2)", nullable: false),
                    Units = table.Column<int>(type: "integer", nullable: false),
                    OrderId = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OrderItems", x => x.Id);
                    table.ForeignKey(
                        name: "FK_OrderItems_Orders_OrderId",
                        column: x => x.OrderId,
                        principalTable: "Orders",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_OrderItems_OrderId",
                table: "OrderItems",
                column: "OrderId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "OrderItems");

            migrationBuilder.DropTable(
                name: "Orders");
        }
    }
}
