namespace Backend_BD.AppCore.Interfaces;

/// <summary>
/// Изолирует ApplicationCore от зависимости на ASP.NET Core фреймворк
/// (чтобы не использовался ILogger из Microsoft.Extensions.Logging)
/// </summary>
/// <typeparam name="T"></typeparam>
public interface IAppLogger<T>
{
    void LogInformation(string message, params object[] args);
    void LogWarning(string message, params object[] args);
}
