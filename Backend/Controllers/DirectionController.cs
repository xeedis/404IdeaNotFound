using Backend.DTO;
using Backend.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DirectionController : ControllerBase
{
    private readonly IDirectionClient _directionClient;

    public DirectionController(IDirectionClient directionClient)
    {
        _directionClient = directionClient;
    }

    [HttpGet]
    public async Task<ActionResult<List<DirectionDto>>> GetRoute([FromQuery] string origin, [FromQuery] string destination)
        =>await _directionClient.GetDirectionAsync(origin, destination);
}