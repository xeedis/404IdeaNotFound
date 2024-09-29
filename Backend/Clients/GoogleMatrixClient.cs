using Backend.DTO;
using Backend.Helpers;
using Newtonsoft.Json.Linq;

namespace Backend.Clients;

public class GoogleMatrixClient : IGoogleMatrixClient
{
    private readonly string _apiKey;

    public GoogleMatrixClient(GoogleMatrixClientOptions options)
    {
        _apiKey = options.Key;
    }

    public async Task<double> GetAverageCarSpeed(DirectionDto startPoint, DirectionDto destinationPoint)
    {
        var origin = $"{startPoint.Lat}%2C{startPoint.Lng}";
        var destination = $"{destinationPoint.Lat}%2C{destinationPoint.Lng}";

        using var client = new HttpClient();
        var requestUri =
            $"https://maps.googleapis.com/maps/api/distancematrix/json?origins={origin}&destinations={destination}&key={_apiKey}&mode=driving";

        var response = await client.GetAsync(requestUri);
        var content = await response.Content.ReadAsStringAsync();
        var jsonResponse = JObject.Parse(content);

        var element = jsonResponse["rows"][0]["elements"][0];
        var distance = (long)element["distance"]["value"]; // in meters
        var duration = (long)element["duration"]["value"]; // in seconds
        var distanceInKm = distance / 1000.0; // convert meters to kilometers
        var timeInHours = duration / 3600.0; // convert seconds to hours

        var averageSpeed = distanceInKm / timeInHours;
        return averageSpeed;
    }
}