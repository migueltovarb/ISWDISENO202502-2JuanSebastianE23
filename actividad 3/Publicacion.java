public abstract class Publicacion {
    private String titulo;
    private double precio;

    public Publicacion(String titulo, double precio) {
        this.titulo = titulo;
        this.precio = precio;
    }

    public String getTitulo() {
        return titulo;
    }

    public double getPrecio() {
        return precio;
    }

    public abstract void mostrar();
}