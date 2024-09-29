using System.Text.Json.Serialization;

namespace Backend.DTO.Accidents;

public sealed class AccidentsDto
{
    [JsonPropertyName("mapa")]
    public MapDto Map { get; set; }

    [JsonPropertyName("zdarzenia_count")]
    public int TotalEvents { get; set; }  
}