using Backend_BD.AppCore.Interfaces;

namespace Backend_BD.AppCore.Services;

public class UriComposer(CatalogSettings catalogSettings) : IUriComposer
{
    public string ComposePicUri(string uriTemplate)
    {
        // placeHolder левая часть заменится на правую в URL картинок (настройка в appsettings)
        // http://catalogbaseurltobereplaced/images/1.png -> /images/1.png
        return uriTemplate.Replace("http://catalogbaseurltobereplaced", catalogSettings.CatalogBaseUrl);
    }
}