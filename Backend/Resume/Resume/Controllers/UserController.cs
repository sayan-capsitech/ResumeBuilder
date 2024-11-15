using Microsoft.AspNetCore.Mvc;
using Resume.Models.User;
using Resume.Services.UserServices;

namespace Resume.Controllers
{
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


        [HttpPost("add")]
        public async Task<ActionResult<Profile>> CreateProfile(Profile profile)
        {
            var newProfile = await _profileService.CreateProfileAsync(profile);
            return CreatedAtAction(nameof(GetProfileById), new { id = newProfile.Id }, newProfile);
        }
       
        [HttpPost("update/{id}")]
        public async Task<ActionResult<Profile>> UpdateProfile(string id, Profile profile)
        {
            var updatedProfile = await _profileService.UpdateProfileAsync(id, profile);
            if (updatedProfile == null) return NotFound();
            return Ok(updatedProfile);
        }
     
        [HttpPost("delete/{id}")]
        public async Task<IActionResult> DeleteProfile(string id)
        {
            var result = await _profileService.DeleteProfileAsync(id);
            if (!result) return NotFound();
            return NoContent();
        }
    }
}
