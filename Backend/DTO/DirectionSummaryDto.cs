namespace Backend.DTO;

public sealed class DirectionSummaryDto
{
    public List<DirectionDto> Points { get; set; }
    public double AverageSpeed { get; set; }
}