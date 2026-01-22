namespace Backend_BD.WebApi;

/// <summary>
/// Базовый класс для всех Response DTO
/// </summary>
public abstract class BaseResponse : BaseMessage
{
    public BaseResponse(Guid correlationId) : base()
    {
        base._correlationId = correlationId;
    }

    public BaseResponse()
    {
    }
}