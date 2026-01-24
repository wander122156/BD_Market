namespace Backend_BD.AppCore.Interfaces;
public interface IEmailSender
{
    Task SendEmailAsync(string email, string subject, string message);
}   