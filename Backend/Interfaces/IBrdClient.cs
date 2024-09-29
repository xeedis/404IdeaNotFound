using Backend.DTO;

namespace Backend.Interfaces;

public interface IBrdClient
{
    Task<IEnumerable<BrdDto>> GetAccidents(DirectionDto startPoint,
        DirectionDto endPoint);
}