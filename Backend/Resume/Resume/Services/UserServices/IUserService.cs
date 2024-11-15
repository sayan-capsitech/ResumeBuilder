using Resume.Models.User;
namespace Resume.Services.UserServices
{
    public interface IUserService
    {
        Task<List<Profile>> GetAllProfilesAsync(); // get
        Task<Profile> GetProfileByIdAsync(string id); // get by id
        Task AddProfileAsync(ProfileRequest profileRequest);
        Task<Profile> CreateProfileAsync(Profile profile); // post or add
        Task<Profile> UpdateProfileAsync(string id, Profile profile); // update
        Task<bool> DeleteProfileAsync(string id);// delete
    }
}
