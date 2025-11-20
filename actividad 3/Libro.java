public class Libro extends Publicacion {
    private String autor;
    private int paginas;

    public Libro(String titulo, double precio, String autor, int paginas) {
        super(titulo, precio);
        this.autor = autor;
        this.paginas = paginas;
    }

    @Override
    public void mostrar() {
        System.out.println("Libro: " + getTitulo() + " por " + autor + ", " + paginas + " páginas, precio: " + getPrecio());
    }
}