using System.Text.Json.Serialization;

namespace Backend.DTO;

public class MunicipalityDto
{
    [JsonPropertyName("zdarzenia")]
    public int Events { get; set; }

    [JsonPropertyName("gmi_nazwa")]
    public string MunicipalityName { get; set; }

    [JsonPropertyName("mie_nazwa")]
    public string PlaceName { get; set; }

    [JsonPropertyName("mie_rodzaj")]
    public string PlaceType { get; set; }

    [JsonPropertyName("gmi_kod")]
    public string MunicipalityCode { get; set; }

    [JsonPropertyName("gmi_rodzaj")]
    public string MunicipalityType { get; set; }

    [JsonPropertyName("fallback_center_lng")]
    public double FallbackCenterLongitude { get; set; }

    [JsonPropertyName("fallback_center_lat")]
    public double FallbackCenterLatitude { get; set; }
}