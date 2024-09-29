namespace Backend.Clients.Models;

public class Instruction
{
    public double Distance { get; set; }
    public double Heading { get; set; }
    public int Sign { get; set; }
    public List<int> Interval { get; set; }
    public string Text { get; set; }
    public int Time { get; set; }
    public string StreetName { get; set; }
}
