
using ProjectCore;
using ProjectCore.Interfaces;
using System.Collections.Generic;
using System.Linq;
using Microsoft.Extensions.DependencyInjection;
using System.IO;
using System.Text.Json;
using System.Text.Json.Serialization;
using ProjectCore.Utilities;
using System.IdentityModel.Tokens.Jwt;
namespace ProjectCore.Services
{
    public class BookService : IBookService
    {
        private readonly string _filePath = "Books.json";
        List<Book> listbooks { get; }
        int nextId = 4;

        public BookService()
        {

            listbooks = FileHelper<Book>.ReadFromJson();
            nextId = listbooks.Any() ? listbooks.Max(b => b.Id) + 1 : 1;
        }

        public IEnumerable<Book> GetAll(string? token)
        {
            int userId = int.Parse(TokenService.decodedToken(token, "UserId"));
            bool isAdmin = bool.Parse(TokenService.decodedToken(token, "isAdmin"));
            if (isAdmin)
            {
                return listbooks;
            }
            return listbooks.Where(book => book.UserId == userId);
        }

        public Book Get(int id, string? token)
        {
            var book = listbooks.FirstOrDefault(b => b.Id == id);
            bool isAdmin = bool.Parse(TokenService.decodedToken(token, "isAdmin"));

            if (book == null || (!isAdmin && book.UserId != int.Parse(TokenService.decodedToken(token))))
            {
                throw new IndexOutOfRangeException($"Book with ID {id} does not exist.");
            }
            return book;
        }
        public void Add(Book book, string? token)
        {
            book.Id = nextId++;
            book.UserId = int.Parse(TokenService.decodedToken(token));
            listbooks.Add(book);
            FileHelper<Book>.WriteToJson(listbooks);

        }

        public void Delete(int id, string? token)
        {
            bool isAdmin = bool.Parse(TokenService.decodedToken(token, "isAdmin"));
            int userId = int.Parse(TokenService.decodedToken(token));
            var book = Get(id, token);
            if (book == null ||( userId != book.UserId&&(!isAdmin)))
            {
                throw new Exception("אינך מורה לגשת לאזור זה ");
            }
            listbooks.Remove(book);
            FileHelper<Book>.WriteToJson(listbooks);

        }
        public void DeleteByUserId(int id)
        {
            listbooks.RemoveAll(book => book.UserId == id);
            FileHelper<Book>.WriteToJson(listbooks);
        }

        public void Update(int id, Book newBook, string? token)
        {
            int userId = int.Parse(TokenService.decodedToken(token));
            var index = listbooks.FindIndex(b => b.Id == newBook.Id);
            bool isAdmin =bool.Parse(TokenService.decodedToken(token,"isAdmin"));
            if (index == -1)
                return;
            if ((listbooks[index].UserId != userId && !isAdmin) || (newBook.UserId != listbooks[index].UserId && !isAdmin))
            {
                throw new Exception("אינך מורשה לגשת לאזור זה ");
            }
            listbooks[index] = newBook;
            FileHelper<Book>.WriteToJson(listbooks);

        }

        public int Count { get => listbooks.Count(); }

    }
    public static class BookServiceHelper
    {
        public static void AddBookService(this IServiceCollection services)
        {
            services.AddSingleton<IBookService, BookService>();
        }
    }

}
