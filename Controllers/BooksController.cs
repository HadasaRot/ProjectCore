
using Microsoft.AspNetCore.Mvc;
using ProjectCore.Interfaces;
namespace ProjectCore.Controllers;
[ApiController]
[Route("[controller]")]
public class BooksController : ControllerBase
{
    private IBookService BookService;
    public BooksController(IBookService BookService)
    {
        this.BookService = BookService;
    }


    [HttpGet]
    public IEnumerable<Book> GetAll()
    {
        return BookService.GetAll();
    }
    [HttpGet("{id}")]
    public ActionResult<Book> Get(int id)
    {
        var book = BookService.Get(id);

        if (book == null)
            return NotFound();

        return book;
    }
    [HttpPost]
    public ActionResult Insert(Book nb)
    {
        BookService.Add(nb);
        return CreatedAtAction(nameof(Insert), new { id = nb.Id }, nb);
    }
    [HttpPut("{id}")]
    public ActionResult Update(int id, Book nb)
    {
        if (id != nb.Id)
            return BadRequest();
        var existingBook = BookService.Get(id);
        if (existingBook is null)
            return NotFound();
        BookService.Update(nb);
        return NoContent();
    }
    [HttpDelete("{id}")]
    public ActionResult Delete(int id)
    {
       var book = BookService.Get(id);
            if (book is null)
                return  NotFound();

            BookService.Delete(id);

            return Content(BookService.Count.ToString());
    }
}