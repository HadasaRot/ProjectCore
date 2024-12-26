using System.Collections.Generic;
using System.Linq;
using ProjectCore;

namespace ProjectCore.Interfaces
{
    public interface IBookService
    {
        List<Book> GetAll();

        Book ?Get(int id);

        void Add(Book pizza);

        void Delete(int id);

        void Update(Book book);

        int Count { get;}//לבדוק?
    }
}
