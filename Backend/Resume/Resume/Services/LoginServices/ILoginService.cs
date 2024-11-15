using Resume.Models;
using Resume.Models.Login;
namespace Resume.Services.LoginServices
{
    public interface ILoginService
    {
        Task<IEnumerable<Login>> GetAllAsync();
        Task AuthenticateUser(Login login);
    }
}




