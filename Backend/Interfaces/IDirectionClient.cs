using Backend.DTO;

namespace Backend.Interfaces;

public interface IDirectionClient
{
    Task<List<DirectionDto>> GetDirectionAsync(string origin, string destination);
}