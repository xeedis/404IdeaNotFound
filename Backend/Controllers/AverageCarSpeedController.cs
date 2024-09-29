using Backend.Clients;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AverageCarSpeedController(IGoogleMatrixClient googleMatrixClient) : ControllerBase
{
    private readonly IGoogleMatrixClient _googleMatrixClient = googleMatrixClient;

    [HttpPost]
    public async Task<double> GetRoute(GetRouteRequest request)
        => await _googleMatrixClient.GetAverageCarSpeed(request.StartLocation, request.EndLocation);
}