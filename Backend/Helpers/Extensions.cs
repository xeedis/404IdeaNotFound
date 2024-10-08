using Backend.Clients;
using Backend.Interfaces;

namespace Backend.Helpers;

public static class Extensions
{
    private const string DirectionOptionsSectionName = "DirectionApiSettings";
    private const string GoogleMatrixClientOptionsSectionName = "GoogleMatrixClientOptionsSectionName";
    
    public static IServiceCollection AddClient(this IServiceCollection services, IConfiguration configuration)
    {
        var directionOptions = configuration.GetOptions<DirectionOptions>(DirectionOptionsSectionName);
        var googleMatrixClientOptions = configuration.GetOptions<GoogleMatrixClientOptions>(GoogleMatrixClientOptionsSectionName);
        services.AddSingleton(directionOptions);
        services.AddSingleton(googleMatrixClientOptions);
        services.AddScoped<IDirectionClient, GraphHopperClient>();
        var brdOptions = configuration.GetOptions<BrdOptions>("brd");
        
        services.Configure<BrdOptions>(configuration.GetRequiredSection("brd"));
        services.AddHttpClient<IBrdClient, BrdClient>(client =>
        {
            client.BaseAddress = new Uri(brdOptions.Url);
        });
        
        services.AddScoped<IBrdClient, BrdClient>();
        services.AddScoped<IGoogleMatrixClient, GoogleMatrixClient>();
        
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