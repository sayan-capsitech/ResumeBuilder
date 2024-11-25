using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Resume.Models.User;
using Resume.Services.UserServices;

namespace Resume.Controllers
{
    [Authorize(AuthenticationSchemes = "Bearer")]
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly IUserService _profileService;
        public UserController(IUserService profileService)
        {
            _profileService = profileService;
        }
      
        [HttpGet]
        public async Task<ActionResult<List<Profile>>> GetAllProfiles()
        {
            var profiles = await _profileService.GetAllProfilesAsync();
            return Ok(profiles);
        }
      
        [HttpGet("{id}")]
        public async Task<ActionResult<Profile>> GetProfileById(string id)
        {
            var profile = await _profileService.GetProfileByIdAsync(id);
            if (profile == null) return NotFound();
            return Ok(profile);
        }

        [HttpPost]
        public async Task<IActionResult> AddProfile([FromForm] ProfileRequest request)
        {

            await _profileService.AddProfileAsync(request);
            return Ok(new { message = "Profile Added successfully." });

        }

        [HttpPost("update/{id}")]
        public async Task<IActionResult> UpdateProfile(string id, [FromForm] ProfileRequest request)
        {
            await _profileService.UpdateProfileAsync(id, request);
            return Ok(new { message = "Profile updated successfully." });
        }



        [HttpGet("search")]
        public async Task<ActionResult<List<Profile>>> SearchProfiles([FromQuery] string name)
        {
            var profiles = await _profileService.SearchProfilesByNameAsync(name);
            return Ok(profiles);
        }


        [HttpPut("delete/{id}")]
        public async Task<IActionResult> SoftDeleteProfile(string id)
        {
            await _profileService.SoftDeleteProfileAsync(id);
            return Ok(new { message = "Profile marked as deleted." });
        }

        [HttpPut("undo/{id}")]
        public async Task<IActionResult> UndoDeleteProfile(string id)
        {
            await _profileService.UndoDeleteProfileAsync(id);
            return Ok(new { message = "Profile deletion undone." });
        }

    }
}
