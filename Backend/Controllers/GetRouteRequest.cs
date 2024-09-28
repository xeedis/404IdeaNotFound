using Backend.DTO;

namespace Backend.Controllers;

public class GetRouteRequest
{
    public DirectionDto StartLocation { get; set; }
    public DirectionDto EndLocation { get; set; }
}