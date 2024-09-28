using Backend.Helpers;

var builder = WebApplication.CreateBuilder(args);



builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services
    .AddCors(cors =>
    {
        cors.AddPolicy("cors", x =>
        {
            x.WithOrigins("*")
                .WithMethods("POST", "PUT", "DELETE")
                .WithHeaders("Content-Type", "Authorization");
        });
    })
    .AddClient(builder.Configuration);

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("cors");

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
