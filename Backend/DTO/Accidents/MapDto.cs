using System.Text.Json.Serialization;

namespace Backend.DTO.Accidents;

public  class MapDto
{
    [JsonPropertyName("wojewodztwa")]
    public List<ProvinceDto> Provinces { get; set; }

    [JsonPropertyName("zdarzenia_count")]
    public int TotalEvents { get; set; }

    [JsonPropertyName("isMIE")]
    public bool IsMie { get; set; }

    [JsonPropertyName("groupBy")]
    public string GroupBy { get; set; }
}