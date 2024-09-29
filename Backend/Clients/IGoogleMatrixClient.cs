using Backend.DTO;

namespace Backend.Clients;

public interface IGoogleMatrixClient
{
    Task<double> GetAverageCarSpeed(DirectionDto startPoint, DirectionDto destinationPoint);
}