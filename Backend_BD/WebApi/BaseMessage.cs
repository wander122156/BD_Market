namespace Backend_BD.WebApi;

/// <summary>
/// Базовый класс для всех сообщений (Request/Response)
/// Содержит CorrelationId для трассировки запросов
/// </summary>
public abstract class BaseMessage
{
    /// <summary>
    /// Уникальный идентификатор для отслеживания запроса через все сервисы
    /// </summary>
    protected Guid _correlationId = Guid.NewGuid();
    public Guid CorrelationId() => _correlationId;
}