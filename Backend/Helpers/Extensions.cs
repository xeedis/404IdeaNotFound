using Backend.Clients;
using Backend.Interfaces;

namespace Backend.Helpers;

public static class Extensions
{
    private const string SectionName = "direction";
    
    public static IServiceCollection AddClient(this IServiceCollection services, IConfiguration configuration)
    {
        var options = configuration.GetOptions<BrdOptions>("brd");
        
        services.Configure<DirectionOptions>(configuration.GetRequiredSection(SectionName));
        services.Configure<BrdOptions>(configuration.GetRequiredSection("brd"));
        services.AddHttpClient<IBrdClient, BrdClient>(client =>
        {
            client.BaseAddress = new Uri(options.Url);
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