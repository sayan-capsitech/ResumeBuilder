using Resume.Models.Login;
using Microsoft.AspNetCore.Mvc;
using Resume.Services.LoginServices;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Authorization;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Text;

namespace Resume.Controllers
{
    [Authorize(AuthenticationSchemes = "Bearer")]
    [ApiController]
    [Route("api/[controller]")]
    public class LoginController : ControllerBase
    {
        private readonly ILoginService _loginService;
        private readonly IConfiguration _configuration;


        public LoginController(ILoginService loginService, IConfiguration configuration)
        {
            _loginService = loginService;
            _configuration = configuration;

        }


        // get login details
        [HttpGet("users")]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _loginService.GetAllAsync();
            return Ok(users);
        }

        // add or post login credentials
        [HttpPost("add")]
        public async Task<IActionResult> Add([FromBody] Login login)
        {
            await _loginService.AuthenticateUser(login);
            return Ok("Login Credentials Created Successfully");

        }


        // validate login credentials


        //[HttpPost("validate")]
        //public async Task<IActionResult> Validate([FromBody] Login login)
        //{
        //    var user = await _loginService.ValidateUser(login);
        //    if (user != null)
        //    {
        //        return Ok(new { message = "Login Successfull" });
        //    }

        //    return Unauthorized(new { message = "Invalid Credentials" });
        //}

        [AllowAnonymous]
        [HttpPost("validate")]
        public async Task<ActionResult<Login>> Login([FromBody] Login login)
        {
            var user = await _loginService.ValidateUser(login.Username, login.Password);
            if (user == null)
            {
                return Unauthorized(new { message = "Invalid username or password" });
            }
            //  token
            var token = GenerateJwtToken(user);
            return Ok(new { UserName = user.Username, Token = token });
        }
        // JWT Token
        private string GenerateJwtToken(Login user)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new System.Security.Claims.ClaimsIdentity(new[]
                {
              new System.Security.Claims.Claim("id", user.Id.ToString()),
              new System.Security.Claims.Claim("username", user.Username),
          }),
                Expires = DateTime.UtcNow.AddMinutes(30),
                SigningCredentials = credentials
            };
            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}
