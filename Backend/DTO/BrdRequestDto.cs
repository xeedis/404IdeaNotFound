namespace Backend.DTO;

public sealed class BrdRequestDto
{
    public DirectionDto StartPoint { get; set; }
    public DirectionDto EndPoint { get; set; }
}