using System.Text;
using Backend.Clients.Models;
using Backend.DTO;
using Backend.Helpers;
using Backend.Interfaces;
using Newtonsoft.Json;
using JsonSerializer = System.Text.Json.JsonSerializer;

namespace Backend.Clients;

public class GraphHopperClient : IDirectionClient
{
    private readonly IGoogleMatrixClient _googleMatrixClient;
    private readonly string _apiKey;
    private readonly string baseUrl = "https://graphhopper.com/api/1/route";

    public GraphHopperClient(DirectionOptions _options, IGoogleMatrixClient googleMatrixClient)
    {
        _googleMatrixClient = googleMatrixClient;
        _apiKey = _options.Key;
    }

    public async Task<DirectionSummaryDto> GetDirectionAsync(DirectionDto startLocation, DirectionDto endLocation)
    {
        //Change it into factory later
        HttpClient client = new();

        var requestBody = new
        {
            profile = "bike",
            points = new[]
            {
                new[] { startLocation.Lng, startLocation.Lat }, // Array of coordinates
                new[] { endLocation.Lng, endLocation.Lat }
            },
            snap_preventions = new[]
            {
                "motorway",
                "ferry",
                "tunnel"
            }
        };

        var json = JsonSerializer.Serialize(requestBody);

        using StringContent postData = new(json, Encoding.UTF8, "application/json");
        using var response =
            await client.PostAsync($"https://graphhopper.com/api/1/route?key={_apiKey}", postData);


        var responseBody = await response.Content.ReadAsStringAsync();
        var mappedResponse = JsonConvert.DeserializeObject<RouteResponse>(responseBody);

        var points = mappedResponse.Paths.SelectMany(a => PolylineDecoder.Decode(a.Points)).ToList();
        var averageSpeed = await _googleMatrixClient.GetAverageCarSpeed(points.FirstOrDefault(),points.LastOrDefault());

        return new DirectionSummaryDto
        {
            AverageSpeed = averageSpeed,
            Points = points
        };
    }
}