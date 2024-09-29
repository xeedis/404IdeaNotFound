using Backend.DTO;
using Backend.DTO.Accidents;
using Backend.Helpers;
using Backend.Interfaces;
using Microsoft.Extensions.Options;

namespace Backend.Clients;

internal sealed class BrdClient : IBrdClient
{
    private readonly HttpClient _client;
    private readonly BrdOptions _options;

    public BrdClient(IOptions<BrdOptions> options, HttpClient httpclient)
    {
        _client = httpclient;
        _options = options.Value;
    }
    
    public async Task<IEnumerable<BrdDto>> GetAccidents(DirectionDto startPoint, 
        DirectionDto endPoint)
    {
        var content = new FormUrlEncodedContent(CreatePayload(startPoint.Lat, 
            startPoint.Lng, endPoint.Lat, endPoint.Lng));

        var response = await _client.PostAsync(_options.Url, content);
            
        var accidents = await response.Content.ReadFromJsonAsync<AccidentsDto>();

        var result = accidents.Map.Provinces
            .SelectMany(province => province.Counties)
            .Select(county => new BrdDto
            {
                Lat = county.FallbackCenterLatitude, 
                Lng = county.FallbackCenterLongitude
            })
            .Distinct()
            .ToList();

        return result;
    }

    private IEnumerable<KeyValuePair<string, string>> CreatePayload(double rightCornerLat, double rightCornerLng, 
        double leftCornerLat, double leftCornerLng)
        => new List<KeyValuePair<string, string>>()
        {
            new("type", "COUNT"), 
            new("rok[]", "2023"),
            new("rok[]", "2022"),
            new("rok[]", "2021"),
            new("rodzaj_pojazdu_uczestnika[]", "10"),
            new("wybrane_wojewodztwa[]", "14"),
            new("q", ""),
            new("dzientyg[]", "6"),
            new("groupBy", "POW"),
            new("obszar_mapy[topRightCorner][lat]", $"{rightCornerLat}"),
            new("obszar_mapy[topRightCorner][lng]", $"{rightCornerLng}"),
            new("obszar_mapy[bottomLeftCorner][lat]", $"{leftCornerLat}"),
            new("obszar_mapy[bottomLeftCorner][lng]", $"{leftCornerLng}")
        };
}