
using System;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProjectCore.Interfaces;
using ProjectCore.Services;

namespace ProjectCore.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UserController : Controller
    {
        private IUserService userService;
        private IBookService bookService;
        public UserController(IUserService userService, IBookService bookService)
        {
            this.userService = userService;
            this.bookService = bookService;
        }

        [HttpPost]
        [Route("[action]")]
        public ActionResult<String>? Login([FromBody] User user)
        {
            var result = userService.Login(user);
            if (result == null)
            {
                return Unauthorized();
            }
            return result;
        }

        [HttpGet]
        [Authorize(Policy = "Admin")]
        public IEnumerable<User> Get(string? token)
        {
            return userService.GetAll();
        }

        [HttpGet("{id}")]
        [Authorize(Policy = "User")]
        public ActionResult<User> Get(int id)
        {
            string? jwtEncoded = Request.Headers.Authorization;////אולי להפוך משתנה מחלקה
            var user = userService.Get(id, jwtEncoded);
            if (user == null)
                return NotFound();
            return user;
        }

        [Authorize(Policy = "Admin")]
        [HttpPost]
        public ActionResult Insert(User user)
        {
            userService.Add(user);
            return CreatedAtAction(nameof(Insert), new { id = user.UserId }, user);
        }

        [HttpDelete("{id}")]
        [Authorize(Policy = "Admin")]
        public ActionResult Delete(int id)
        {
            string? jwtEncoded = Request.Headers.Authorization;
            var foundUser = userService.Get(id, jwtEncoded);
            if (foundUser is null)
                return NotFound();
            userService.Delete(id);
            bookService.DeleteByUserId(id);
            return Content(userService.Count.ToString());
        }

        [HttpPut("{id}")]
        public ActionResult Update(int id,User user)
        {
             string? jwtEncoded = Request.Headers.Authorization;
             userService.Update(id,user,jwtEncoded);
             return Content(userService.Count.ToString());
        
        }

    }
}