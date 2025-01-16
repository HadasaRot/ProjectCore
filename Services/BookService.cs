using ProjectCore;
using ProjectCore.Interfaces;
using System.Collections.Generic;
using System.Linq;
using Microsoft.Extensions.DependencyInjection;



namespace ProjectCore.Services
{
    public class BookService : IBookService
    {
        List<Book> ListBooks { get; }
        int nextId = 4;
        public BookService()
        {
            ListBooks = new List<Book>
            {
            new Book { Id = 1, Name = "math" ,Category=CategoryBooks.Textbook},
            new Book { Id = 2, Name = "With a nation builder", Category = CategoryBooks.History},
            new Book { Id = 3, Name = "The country", Category = CategoryBooks.Philosophy}
            };
        }

        public List<Book> GetAll() => ListBooks;
        public Book? Get(int id) => ListBooks.FirstOrDefault(b => b.Id == id);

        public void Add(Book book)
        {
            book.Id = nextId;
            ListBooks.Add(book);
            nextId++;   
        }

        public void Delete(int id)
        {
            var book = Get(id);
            if (book is null)
                return;

            ListBooks.Remove(book);
        }

        public void Update(Book book)
        {
            var index = ListBooks.FindIndex(b => b.Id == book.Id);
            if (index == -1)
                return;

            ListBooks[index] = book;
        }

        public int Count { get => ListBooks.Count(); }
    }
    
    public static class BookServiceHelper
    {
        public static void AddPizzaService(this IServiceCollection services)
        {
            services.AddSingleton<IBookService , BookService>();    
        }
    }

}