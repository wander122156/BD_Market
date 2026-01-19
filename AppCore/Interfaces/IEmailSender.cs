namespace Backend_BD.Interfaces;
public interface IEmailSender
{
    Task SendEmailAsync(string email, string subject, string message);
}   