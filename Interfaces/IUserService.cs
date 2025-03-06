
using Microsoft.AspNetCore.Mvc;

namespace ProjectCore.Interfaces
{
      public interface IUserService
    {
        IEnumerable <User> GetAll();

        User ?Get(int id, string ? token);

        void Add(User user);

        void Delete(int id);

        void Update(int id, User newUser, string? token);
         public ActionResult<String> Login(User user);
        int Count { get;} 

    }
}