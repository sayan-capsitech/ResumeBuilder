using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Resume.Models.Login
{
    public class Login
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [BsonElement("username")]
        public string? Username { get; set; }

        [BsonElement("password")]
        public string? Password { get; set; }

        [BsonElement("usertype")]
        public string? UserType { get; set; }

    }
}

