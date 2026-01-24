# DI
### Регистрация зависимостей (Program.cs)

Говорим ASP.NET Core: "Если кто-то попросит IRepository<T>, дай ему EfRepository<T>"
`builder.Services.AddScoped(typeof(IRepository<>), typeof(EfRepository<>));`

Если попросят CatalogContext, создай его с этой строкой подключения
`builder.Services.AddDbContext<CatalogContext>(options =>
options.UseSqlServer(connectionString));`

Если попросят ILogger<T>, создай его
`builder.Services.AddLogging();`

### Запрос зависимостей (в конструкторе endpoint)

```
public class CatalogBrandListEndpoint(
    IRepository<CatalogBrand> catalogBrandRepository,  // ← Запрашиваем
    ILogger<CatalogBrandListEndpoint> logger           // ← Запрашиваем
)
```

### ASP.NET Core автоматически создаёт и передаёт

Вместо того чтобы в HandleAsync было
```
 public override async Task HandleAsync(CancellationToken ct)
    {
        var connectionString = "Server=localhost;Database=Catalog;...";
        var options = new DbContextOptionsBuilder<CatalogContext>()
            .UseSqlServer(connectionString)
            .Options;
        var context = new CatalogContext(options);
        var repository = new EfRepository<CatalogBrand>(context);
        
        var brands = await repository.ListAsync(ct);
    }
```
ASP.NET делает за вас 
```
var connectionString = configuration.GetConnectionString("CatalogContext");
var context = new CatalogContext(connectionString);
var repository = new EfRepository<CatalogBrand>(context);
var logger = loggerFactory.CreateLogger<CatalogBrandListEndpoint>();

// И передаёт в конструктор:
var endpoint = new CatalogBrandListEndpoint(repository, logger);
```
и остается только:
```
public override async Task HandleAsync(CancellationToken ct)
    {
        var brands = await repository.ListAsync(ct);
    }
```

### Время жизни (Lifetime)

#### AddScoped — на запрос
```
builder.Services.AddScoped(typeof(IRepository<>), typeof(EfRepository<>));
```
#### Поведение:

- Создаётся 1 раз на HTTP-запрос
- Все endpoint'ы в одном запросе получают один экземпляр
- После завершения запроса — уничтожается

#### Пример:

Request 1:
- CatalogBrandEndpoint получает EfRepository#1
- CatalogTypeEndpoint получает EfRepository#1 (тот же)
- Запрос завершён → EfRepository#1.Dispose()

Request 2:
- CatalogBrandEndpoint получает EfRepository#2 (новый)