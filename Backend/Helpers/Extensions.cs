using Backend.Clients;
using Backend.Interfaces;

namespace Backend.Helpers;

public static class Extensions
{
    private const string SectionName = "DirectionApiSettings";
    
    public static IServiceCollection AddClient(this IServiceCollection services, IConfiguration configuration)
    {
        var directionOptions = configuration.GetOptions<DirectionOptions>(SectionName);
        services.AddSingleton(directionOptions);
        services.AddScoped<IDirectionClient, GraphHopperClient>();
        var brdOptions = configuration.GetOptions<BrdOptions>("brd");
        
        services.Configure<DirectionOptions>(configuration.GetRequiredSection(SectionName));
        services.Configure<BrdOptions>(configuration.GetRequiredSection("brd"));
        services.AddHttpClient<IBrdClient, BrdClient>(client =>
        {
            client.BaseAddress = new Uri(brdOptions.Url);
        });
        
        services.AddScoped<IBrdClient, BrdClient>();
        
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