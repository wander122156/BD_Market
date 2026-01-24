namespace Backend_BD.AppCore.Interfaces;

public interface IUriComposer // Для генерации полных Url
{ 
    string ComposePicUri(string uriTemplate);
}