
using Microsoft.AspNetCore.Mvc;
using System.Net.NetworkInformation;
using Microsoft.AspNetCore.Authorization;
using ProjectCore.Interfaces;
namespace ProjectCore.Controllers;

[ApiController]
[Route("[controller]")]
[Authorize]

public class BooksController : ControllerBase
{
   private IBookService bookService;
   public BooksController(IBookService bookService)
   {
      this.bookService = bookService;
   }

   [HttpGet]
   public IEnumerable<Book> GetAll()
   {
      string? jwtEncoded = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
      return bookService.GetAll(jwtEncoded);
   }
   [HttpGet("{id}")]
   public ActionResult<Book> Get(int id)
   {
      string? jwtEncoded = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
      var book = bookService.Get(id, jwtEncoded);
      if (book == null)
         return NotFound();
      return book;
   }
   [HttpPost]
   public ActionResult Insert(Book nb)
   {
      string? jwtEncoded = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
      bookService.Add(nb, jwtEncoded);
      return CreatedAtAction(nameof(Insert), new { id = nb.Id }, nb);
   }
   [HttpPut("{id}")]
   public ActionResult Update(int id, Book nb)
   {
      if (id != nb.Id)
         return BadRequest();
      string? jwtEncoded = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
      var existingBook = bookService.Get(id, jwtEncoded);
      if (existingBook is null)
         return NotFound();
      bookService.Update(id, nb, jwtEncoded);
      return NoContent();
   }
   [HttpDelete("{id}")]
   public ActionResult Delete(int id)
   {
      string? jwtEncoded = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
      var foundBook = bookService.Get(id, jwtEncoded);
      if (foundBook is null)
         return NotFound();
      bookService.Delete(id, jwtEncoded);
      return Content(bookService.Count.ToString()); 
   }
}