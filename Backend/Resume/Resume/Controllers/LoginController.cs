using Resume.Models.Login;
using Microsoft.AspNetCore.Mvc;
using Resume.Services.LoginServices;

namespace Resume.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LoginController : ControllerBase
    {
        private readonly ILoginService _loginService;

        public LoginController(ILoginService loginService)
        {
            _loginService = loginService;
        }


        [HttpGet("users")]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _loginService.GetAllAsync();
            return Ok(users);
        }

        [HttpPost("authenticate")]
        public async Task<IActionResult> Authenticate([FromBody] Login login)
        {
            await _loginService.AuthenticateUser(login);
            return Ok("Login Succesfull");

        }
    }
}
