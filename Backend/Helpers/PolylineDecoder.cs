using Backend.DTO;

namespace Backend.Helpers;

public static class PolylineDecoder
{
    public static List<DirectionDto> Decode(string encodedPolyline)
    {
        if (string.IsNullOrEmpty(encodedPolyline))
            return null;

        var polylineChars = encodedPolyline.ToCharArray();
        var index = 0;
        var currentLat = 0;
        var currentLng = 0;
        var poly = new List<DirectionDto>();

        while (index < polylineChars.Length)
        {
            int sum = 0;
            int shifter = 0;
            int next5Bits;
            do
            {
                next5Bits = polylineChars[index++] - 63;
                sum |= (next5Bits & 31) << shifter;
                shifter += 5;
            }
            while (next5Bits >= 32 && index < polylineChars.Length);

            currentLat += (sum & 1) != 0 ? ~(sum >> 1) : (sum >> 1);
            
            sum = 0;
            shifter = 0;
            do
            {
                next5Bits = polylineChars[index++] - 63;
                sum |= (next5Bits & 31) << shifter;
                shifter += 5;
            }
            while (next5Bits >= 32 && index < polylineChars.Length);

            currentLng += (sum & 1) != 0 ? ~(sum >> 1) : (sum >> 1);

            var lat = currentLat / 1e5;
            var lng = currentLng / 1e5;
            poly.Add(new DirectionDto
            {
                Lat = lat,
                Lng = lng
            });
        }

        return poly;
    }
}