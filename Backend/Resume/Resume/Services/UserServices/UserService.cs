using Microsoft.Extensions.Options;
using System.Linq;
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

    // Get 
    public async Task<List<Profile>> GetAllProfilesAsync()
    {
        return await _profiles.Find(profile => true).ToListAsync();
    }

    // Searching
    public async Task<List<Profile>> SearchProfilesByNameAsync(string name)
    {
        var filter = Builders<Profile>.Filter.Regex(p => p.Name, new MongoDB.Bson.BsonRegularExpression(name, "i"));
        return await _profiles.Find(filter).ToListAsync();
    }

    // SoftDelete
    public async Task SoftDeleteProfileAsync(string id)
    {
        var update = Builders<Profile>.Update.Set(p => p.IsDeleted, true);
        await _profiles.UpdateOneAsync(p => p.Id == id, update);
    }

    //Undo
    public async Task UndoDeleteProfileAsync(string id)
    {
        var update = Builders<Profile>.Update.Set(p => p.IsDeleted, false);
        await _profiles.UpdateOneAsync(p => p.Id == id, update);
    }

    //Get By Id
    public async Task<Profile> GetProfileByIdAsync(string id)
    {
        return await _profiles.Find(profile => profile.Id == id).FirstOrDefaultAsync();
    }

    //Add or Post
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

    public async Task UpdateProfileAsync(string id, ProfileRequest profileRequest)
    {
        var updateDefinition = Builders<Profile>.Update
            .Set(p => p.Name, profileRequest.Name)
            .Set(p => p.Address, profileRequest.Address)
            .Set(p => p.Phone, profileRequest.Phone)
            .Set(p => p.Email, profileRequest.Email)
            .Set(p => p.Designation, profileRequest.Designation)
            .Set(p => p.Description, profileRequest.Description)
            .Set(p => p.About, profileRequest.About)
            .Set(p => p.Education, profileRequest.Education)
            .Set(p => p.Experience, profileRequest.Experience);

        if (profileRequest.Image != null)
        {
            var imagePath = await SaveFileAsync(profileRequest.Image);
            updateDefinition = updateDefinition.Set(p => p.Image, imagePath);
        }

        if (profileRequest.Signature != null)
        {
            var signaturePath = await SaveFileAsync(profileRequest.Signature);
            updateDefinition = updateDefinition.Set(p => p.Signature, signaturePath);
        }

        var result = await _profiles.UpdateOneAsync(
            Builders<Profile>.Filter.Eq(p => p.Id, id),
            updateDefinition
        );

        if (result.MatchedCount == 0)
        {
            throw new Exception("Profile not found");
        }
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

}