
using ProjectCore;
using Microsoft.AspNetCore.Authorization;
using ProjectCore.Interfaces;
using System.Collections.Generic;
using System.Linq;
using Microsoft.Extensions.DependencyInjection;
using ProjectCore.Utilities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http.HttpResults;
using System.Security.Claims;
using ProjectCore.Services;
namespace ProjectCore.Services
{
    public class UserService : IUserService
    {
        List<User> listUsers { get; }
        int nextId = 4;
        public UserService()
        {
            listUsers = FileHelper<User>.ReadFromJson();
            nextId = listUsers.Any() ? listUsers.Max(u => u.UserId) + 1 : 1;

        }
        public ActionResult<String>? Login(User user)
        {
            var findUser = listUsers.FirstOrDefault(u => u.Username == user.Username &&u.Password == user.Password);
            if (findUser == null )
            {
                return null;
            }

            var claims = new List<Claim>
            {
                new Claim("UserId", findUser.UserId+""),
                new Claim("Username", findUser.Username),
                new Claim("isAdmin", findUser.isAdmin ? "true" : "false")

            };
            var token = TokenService.GetToken(claims);
            return new OkObjectResult(TokenService.WriteToken(token));
        }
        public IEnumerable<User> GetAll() => listUsers;

        public User Get(int id, string? token)
        {
            string userId = TokenService.decodedToken(token);
            string isAdmin = TokenService.decodedToken(token, "isAdmin");
            var user = listUsers.FirstOrDefault(u => u.UserId == id);
            if (user == null || (userId != id + "" && isAdmin == "false"))
                throw new IndexOutOfRangeException($"user with ID {id} does not exist.");
            return user;
        }
        public void Add(User user)
        {
            user.UserId = nextId++;
            listUsers.Add(user);
            FileHelper<User>.WriteToJson(listUsers);
        }

        public void Delete(int id)
        {
            var user = listUsers.FirstOrDefault(u => u.UserId == id);
            if (user == null)
            {
                throw new IndexOutOfRangeException($"user with {id} does not exist");
            }
            listUsers.Remove(user);
            FileHelper<User>.WriteToJson(listUsers);
        }

        public void Update(int id, User user, string? token)
        {
            string userId = TokenService.decodedToken(token);
            string isAdmin = TokenService.decodedToken(token, "isAdmin");
            if (isAdmin == "false" && user.isAdmin == true)
            {
                throw new Exception($"You cannot change your access permissions.");
            }
            if (isAdmin == "false" && (userId != id + "" || user.UserId + "" != userId))
            {
                throw new Exception("You cannot change your access permissions.");
            }
            var index = listUsers.FindIndex(u => u.UserId == user.UserId);
            if (index == -1)
                throw new KeyNotFoundException($"User with ID {user.UserId} does not exist.");

            listUsers[index] = user;
            FileHelper<User>.WriteToJson(listUsers);
        }






        public int Count { get => listUsers.Count(); }
    }
    public static class UserServiceHelper
    {
        public static void AddUserService(this IServiceCollection services)
        {
            services.AddSingleton<IUserService, UserService>();
        }
    }

}
