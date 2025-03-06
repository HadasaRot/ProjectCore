
using System.Collections;
using System.Collections.Generic;
using System.Linq;
namespace ProjectCore.Interfaces
{
    public interface IBookService
    {
        IEnumerable<Book> GetAll(string ? token);

        Book ?Get(int id, string? token);

        void Add(Book task, string? token);

        void Delete(int id, string? token);

        void Update(int id,  Book newBook ,string? token);
        void DeleteByUserId(int userId);
        int Count { get;}  
    }
}