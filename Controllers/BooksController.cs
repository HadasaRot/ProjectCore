
using Microsoft.AspNetCore.Mvc;
namespace ProjectCore.Controllers;
[ApiController]
[Route("[controller]")]
public class BooksController : ControllerBase
{
    private static List<Book> list;
    static BooksController()
    {
        list = new List<Book> 
        {
            new Book { Id = 1, Name = "math" ,Category=CategoryBooks.Textbook},
            new Book { Id = 2, Name = "With a nation builder", Category = CategoryBooks.History},
            new Book { Id = 3, Name = "The country", Category = CategoryBooks.Philosophy}
        };
    }
    [HttpGet]
    public IEnumerable<Book> Get()
    {
        return list;
    }
    [HttpGet("{id}")]
    public ActionResult<Book> Get(int id)
    {
        var book = list.FirstOrDefault(b => b.Id == id);
        if (book == null)
            return BadRequest("invalid id");
        return book;
    }
    [HttpPost] 
    public ActionResult Insert(Book nb)
    {        
        var maxId = list.Max(b => b.Id);
        nb.Id = maxId + 1;
        list.Add(nb);
        return CreatedAtAction(nameof(Insert), new { id = nb.Id }, nb);
    }  
    [HttpPut("{id}")]
    public ActionResult Update(int id, Book nb)
    { 
        var oldBook = list.FirstOrDefault(b => b.Id == id);
        if (oldBook == null) 
            return BadRequest("invalid id");
        if (nb.Id != oldBook.Id)
            return BadRequest("id mismatch");
        oldBook.Name = nb.Name;
        oldBook.Category = nb.Category;
        return NoContent();
    } 
   [HttpDelete("{id}")]
   public ActionResult Delete(int id){
        var foundBook = list.FirstOrDefault(b => b.Id == id);
         if (foundBook == null) 
            return BadRequest("invalid id");
        list.Remove(foundBook);
        return NoContent();
   }
}