public class Disco extends Publicacion {
    private String artista;
    private int duracion; // en minutos

    public Disco(String titulo, double precio, String artista, int duracion) {
        super(titulo, precio);
        this.artista = artista;
        this.duracion = duracion;
    }

    @Override
    public void mostrar() {
        System.out.println("Disco: " + getTitulo() + " por " + artista + ", duración: " + duracion + " min, precio: " + getPrecio());
    }
}