﻿using Microsoft.Extensions.Options;
using MongoDB.Driver;
using Resume.Models;
using Resume.Services.LoginServices;
using Resume.Models.Login;

namespace Resume.Services.LoginServices
{
    public class LoginService : ILoginService
    {
        private readonly IMongoCollection<Login> _loginCollection;

        public LoginService(IOptions<DatabaseSettings> dbSettings)
        {
            var mongoClient = new MongoClient(dbSettings.Value.ConnectionString);
            var database = mongoClient.GetDatabase(dbSettings.Value.DatabaseName);
            _loginCollection = database.GetCollection<Login>(dbSettings.Value.LoginCollectionName);
        }

        public async Task<IEnumerable<Login>> GetAllAsync()
        {
            var users = await _loginCollection.Find(_ => true).ToListAsync();
            return users;
        }
        public async Task AuthenticateUser(Login login) =>
            await _loginCollection.InsertOneAsync(login);



        //public async Task<Login?> ValidateUser(Login login)
        //{
        //    return await _loginCollection.Find(x =>
        //    x.Username == login.Username &&
        //    x.Password == login.Password).
        //    FirstOrDefaultAsync();
        //}

        //public async Task<Login?> ValidateUser(string Username, string Password)
        //{
        //    return await _loginCollection.Find(x =>
        //    x.Username == Username &&
        //    x.Password == Password).
        //    FirstOrDefaultAsync();
        //}


        public async Task<Login> ValidateUser(string username, string password)
        {
            var user = await _loginCollection.Find(t => t.Username == username).FirstOrDefaultAsync();
            if (user != null && password == user.Password)
            {
                return user;
            }
            return null;
        }
    }
}

