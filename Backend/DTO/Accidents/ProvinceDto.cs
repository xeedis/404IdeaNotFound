using System.Text.Json.Serialization;

namespace Backend.DTO.Accidents;

public class ProvinceDto
{
    [JsonPropertyName("powiaty")]
    public List<CountyDto> Counties { get; set; }

    [JsonPropertyName("woj_nazwa")]
    public string ProvinceName { get; set; }

    [JsonPropertyName("woj_kod")]
    public string ProvinceCode { get; set; }

    [JsonPropertyName("zdarzenia")]
    public int Events { get; set; }

    [JsonPropertyName("fallback_center_lng")]
    public double FallbackCenterLongitude { get; set; }

    [JsonPropertyName("fallback_center_lat")]
    public double FallbackCenterLatitude { get; set; }
}