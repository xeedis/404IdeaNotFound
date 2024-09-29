namespace Backend.Clients.Models;

public class RouteResponse
{
    public Hints Hints { get; set; }
    public Info Info { get; set; }
    public List<Path> Paths { get; set; }
}