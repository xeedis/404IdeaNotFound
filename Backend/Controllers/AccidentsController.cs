using Backend.DTO;
using Backend.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AccidentsController : ControllerBase
{
    private readonly IBrdClient _brdClient;

    public AccidentsController(IBrdClient brdClient)
    {
        _brdClient = brdClient;
    }

    [HttpGet]
    public async Task<IEnumerable<BrdDto>> GetAccidents([FromQuery] BrdRequestDto request)
        => await _brdClient.GetAccidents(request.StartPoint, request.EndPoint);
}