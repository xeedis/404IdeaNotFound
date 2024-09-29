using Backend.DTO;

namespace Backend.Interfaces;

public interface IDirectionClient
{
    Task<DirectionSummaryDto> GetDirectionAsync(DirectionDto startLocation, DirectionDto endLocation);
}