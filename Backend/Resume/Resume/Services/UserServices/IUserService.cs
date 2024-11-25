using Resume.Models.User;
namespace Resume.Services.UserServices
{
    public interface IUserService
    {
        Task<List<Profile>> GetAllProfilesAsync(); // get
        Task<Profile> GetProfileByIdAsync(string id); // get by id

        Task<List<Profile>> SearchProfilesByNameAsync(string name); // searching
        Task AddProfileAsync(ProfileRequest profileRequest); // add 
        Task UpdateProfileAsync(string id, ProfileRequest profileRequest); // Update Profile
        Task SoftDeleteProfileAsync(string id);
        Task UndoDeleteProfileAsync(string id);
    }
}
