// Actividad 3 - Clase Publicacion
public abstract class Publicacion {
    protected String titulo;
    protected int anioPublicacion;

    public Publicacion(String titulo, int anioPublicacion) {
        this.titulo = titulo;
        this.anioPublicacion = anioPublicacion;
    }

    public abstract void mostrarInformacion();
}