namespace ProjectCore
{

public enum CategoryBooks
{
    Biography,   //0 
    Textbook,   //1
    Tension,   //2
    History, //3
    Science,    //4
    Philosophy  //5
}
public class Book
{
    public int Id { get; set; }
    public string ?Name { get; set; }
    public CategoryBooks Category { get; set; }
    public int UserId { get; set; }

}
}