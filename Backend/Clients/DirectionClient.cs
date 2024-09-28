// using Backend.DTO;
// using Backend.Helpers;
// using Backend.Interfaces;
// using GoogleMapsApi;
// using GoogleMapsApi.Entities.Directions.Request;
// using GoogleMapsApi.Entities.Directions.Response;
// using Microsoft.Extensions.Options;
//
// namespace Backend.Clients;
//
// public sealed class DirectionClient : IDirectionClient
// {
//     private readonly DirectionOptions _options;
//
//     public DirectionClient(IOptions<DirectionOptions> options)
//     {
//         _options = options.Value;
//     }
//
//     public async Task<List<DirectionDto>> GetDirectionAsync(DirectionDto startLocation, DirectionDto endLocation)
//     {
//         var request = new DirectionsRequest
//         {
//             ApiKey = _options.Key,
//             Origin = "Warszawa",
//             Destination = "Kraków",
//             TravelMode = TravelMode.Driving
//         };
//
//         var response = await GoogleMaps.Directions.QueryAsync(request);
//         
//         if(response.Status is not DirectionsStatusCodes.OK)
//             throw new Exception(response.Status.ToString());
//         
//         var route = response.Routes.FirstOrDefault();
//         
//         var overviewPolyline = route?.OverviewPath.Points;
//
//         var result = overviewPolyline?
//             .Select(point => new DirectionDto
//             {
//                 Lat = point.Latitude, 
//                 Lng = point.Longitude
//                 
//             })
//             .ToList();
//
//         return result;
//     }
// }