using Microsoft.Extensions.Options;
using MongoDB.Driver;
using Resume.Models;
using Resume.Models.Login;
using Resume.Models.User;
using System.IO;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;


namespace Resume.Services.UserServices;

public class UserService : IUserService
{

    private readonly IMongoCollection<Profile> _profiles;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public object Request { get; private set; }

    public UserService(IOptions<DatabaseSettings> dbSettings, IHttpContextAccessor httpContextAccessor)
    {
        var mongoClient = new MongoClient(dbSettings.Value.ConnectionString);
        var database = mongoClient.GetDatabase(dbSettings.Value.DatabaseName);
        _profiles = database.GetCollection<Profile>(dbSettings.Value.UserInfoCollectionName);
        _httpContextAccessor = httpContextAccessor;  // Initialize the accessor
    }
    public async Task<List<Profile>> GetAllProfilesAsync()
    {
        return await _profiles.Find(profile => true).ToListAsync();
    }

    public async Task<Profile> GetProfileByIdAsync(string id)
    {
        return await _profiles.Find(profile => profile.Id == id).FirstOrDefaultAsync();
    }

    public async Task AddProfileAsync(ProfileRequest profileRequest)
    {
        // Map ProfileRequest to Profile model
        var profile = new Profile
        {
            Name = profileRequest.Name,
            Address = profileRequest.Address,
            Phone = profileRequest.Phone,
            Email = profileRequest.Email,
            Designation = profileRequest.Designation,
            Description = profileRequest.Description,
            About = profileRequest.About,
            Education = profileRequest.Education ?? new List<Education>(),
            Experience = profileRequest.Experience ?? new List<Experience>(),
            IsDeleted = profileRequest.IsDeleted
        };
        // Process Image file
        if (profileRequest.Image != null)
        {
            profile.Image = await SaveFileAsync(profileRequest.Image);
        }
        // Process Signature file
        if (profileRequest.Signature != null)
        {
            profile.Signature = await SaveFileAsync(profileRequest.Signature);
        }
        // Insert profile data into MongoDB
        await _profiles.InsertOneAsync(profile);
    }

    // Helper method to save uploaded file and return the file path
    private async Task<string> SaveFileAsync(IFormFile file)
    {
        var uploadsFolder = Path.Combine("wwwroot", "uploads");
        if (!Directory.Exists(uploadsFolder))
        {
            Directory.CreateDirectory(uploadsFolder);
        }
        var filePath = Path.Combine(uploadsFolder, file.FileName);
        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        // Get the base URL for the image
        var baseUrl = $"{_httpContextAccessor?.HttpContext?.Request.Scheme}://{_httpContextAccessor.HttpContext.Request.Host}/uploads/";  // Use IHttpContextAccessor to get the current request

        return $"{baseUrl}{file.FileName}";
    }


public async Task<Profile> CreateProfileAsync(Profile profile)
    {
        await _profiles.InsertOneAsync(profile);
        return profile;
    }
    public async Task<Profile> UpdateProfileAsync(string id, Profile profile)
    {
        profile.Id = id; // Set the existing profile's Id to ensure it matches the ID to be updated
        var result = await _profiles.ReplaceOneAsync(p => p.Id == id, profile);
        return result.MatchedCount > 0 ? profile : null;
    }
    public async Task<bool> DeleteProfileAsync(string id)
    {
        var result = await _profiles.DeleteOneAsync(p => p.Id == id);
        return result.DeletedCount > 0;
    }

}