using Resume.Models;
using Resume.Models.Login;
namespace Resume.Services.LoginServices
{
    public interface ILoginService
    {
        Task<IEnumerable<Login>> GetAllAsync();// get login details
        Task AuthenticateUser(Login login);// post or add login data
        //Task<Login?> ValidateUser(Login login);
        Task<Login?> ValidateUser(string Username, string Password); // validate user
    }
}




