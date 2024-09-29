using System.Text.Json.Serialization;

namespace Backend.DTO.Accidents;

public class CountyDto
{
    [JsonPropertyName("gminy")]
    public List<MunicipalityDto> Municipalities { get; set; }

    [JsonPropertyName("pow_nazwa")]
    public string CountyName { get; set; }

    [JsonPropertyName("pow_kod")]
    public string CountyCode { get; set; }

    [JsonPropertyName("zdarzenia")]
    public int Events { get; set; }

    [JsonPropertyName("fallback_center_lng")]
    public double FallbackCenterLongitude { get; set; }

    [JsonPropertyName("fallback_center_lat")]
    public double FallbackCenterLatitude { get; set; }
}