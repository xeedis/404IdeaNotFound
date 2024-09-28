using Backend.Clients;
using Backend.Interfaces;

namespace Backend.Helpers;

public static class Extensions
{
    private const string SectionName = "DirectionApiSettings";
    
    public static IServiceCollection AddClient(this IServiceCollection services, IConfiguration configuration)
    {
        var options = configuration.GetOptions<DirectionOptions>(SectionName);
        services.AddSingleton(options);
        services.AddScoped<IDirectionClient, GraphHopperClient>();
        
        return services;
    }

    public static T GetOptions<T>(this IConfiguration configuration, string sectionName) where T : class, new()
    {
        var options = new T();
        var section = configuration.GetSection(sectionName);
        section.Bind(options);
        
        return options;
    }
}