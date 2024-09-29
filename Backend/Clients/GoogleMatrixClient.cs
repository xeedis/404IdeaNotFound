using System.Globalization;
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
        var culture = CultureInfo.InvariantCulture;

        var origin = $"{startPoint.Lat.ToString(culture)},{startPoint.Lng.ToString(culture)}";
        var destination = $"{destinationPoint.Lat.ToString(culture)},{destinationPoint.Lng.ToString(culture)}";
        
        var encodedOrigin = Uri.EscapeDataString(origin);
        var encodedDestination = Uri.EscapeDataString(destination);

        using var client = new HttpClient();
        var requestUri =
            $"https://maps.googleapis.com/maps/api/distancematrix/json?destinations={encodedDestination}&origins={encodedOrigin}&mode=driving&key={_apiKey}";


        var response = await client.GetAsync(requestUri);
        var content = await response.Content.ReadAsStringAsync();
        var jsonResponse = JObject.Parse(content);

        var element = jsonResponse["rows"][0]["elements"][0];
        var distance = (long)element["distance"]["value"]; 
        var duration = (long)element["duration"]["value"]; 
        var distanceInKm = distance / 1000.0; 
        var timeInHours = duration / 3600.0; 

        var averageSpeed = distanceInKm / timeInHours;
        return averageSpeed;
    }
}