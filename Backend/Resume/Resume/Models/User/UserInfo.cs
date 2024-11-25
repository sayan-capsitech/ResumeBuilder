using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Text.Json.Serialization;
using System.Collections.Generic;
using System.Runtime.Serialization;
using System.Net;
namespace Resume.Models.User;


public enum EducationalClass
{
    [EnumMember(Value = "10")]
    Ten = 0,

    [EnumMember(Value = "12")]
    Twelve = 1,

    [EnumMember(Value = "BCA")]
    BCA = 2,

    [EnumMember(Value = "Btech")]
    Btech = 3,

}

public class AddressModel
{
    public string ?House { get; set; }
    public string ?Street { get; set; }

    public string ?Landmark { get; set; }

    public string ?District { get; set; }

    public string ?City { get; set; }

    public int Pincode { get; set; }

    public string ?State { get; set; }
}
public class Education
{
    
    public string school { get; set; }
   
    public EducationalClass Class { get; set; } // Options like 10, 12, BTech, etc.
    
    public double Cgpa { get; set; }
   
    public int YearOfPassing { get; set; }
}
public class Experience
{
   
    public string Designation { get; set; }
    public DateOnly FromDate { get; set; }
    
    public DateOnly ToDate { get; set; }
   
    public List<string> Skills { get; set; } = new List<string>();
}
public class Profile
{
    internal string educationJson;

    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string ?Id { get; set; } 
    public string Name { get; set; }
    public AddressModel ?Address { get; set; }
    public string Email { get; set; }
    public long Phone { get; set; }
    public string Designation { get; set; }
    public string Description { get; set; }
    public List<Education> Education { get; set; } = new List<Education>();
    public List<Experience> Experience { get; set; } = new List<Experience>();
    public string About { get; set; }
    public string? Image { get; set; }
    public string? Signature { get; set; }

    public bool IsDeleted { get; set; } 
}

public class ProfileRequest
{

    public string Name { get; set; }
    public AddressModel Address { get; set; }
    public long Phone { get; set; }
    public string Email { get; set; }
    public string Designation { get; set; }
    public string Description { get; set; }
    public string About { get; set; }
    public List<Education> Education { get; set; } = new List<Education>();
    public List<Experience> Experience { get; set; } = new List<Experience>();
    public IFormFile Image { get; set; }
    public IFormFile Signature { get; set; }
    public bool IsDeleted { get; set; }
}
