namespace Backend.Clients.Models;

public class Path
{
    public double Distance { get; set; }
    public double Weight { get; set; }
    public long Time { get; set; }
    public int Transfers { get; set; }
    public bool PointsEncoded { get; set; }
    public double PointsEncodedMultiplier { get; set; }
    public List<double> Bbox { get; set; } // Bounding box
    public string Points { get; set; } // Encoded points string
    public List<Instruction> Instructions { get; set; }
    public List<object> Legs { get; set; } // Assuming legs data isn't defined
    public object Details { get; set; } // Assuming details is not defined
    public double Ascend { get; set; }
    public double Descend { get; set; }
    public string SnappedWaypoints { get; set; }
}
