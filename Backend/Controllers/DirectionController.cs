using Backend.DTO;
using Backend.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DirectionController(IDirectionClient directionClient) : ControllerBase
{
    private readonly IDirectionClient _directionClient = directionClient;

    [HttpPost()]
    public async Task<ActionResult<List<DirectionDto>>> GetRoute(GetRouteRequest request)
        => await _directionClient.GetDirectionAsync(request.StartLocation, request.EndLocation);
}