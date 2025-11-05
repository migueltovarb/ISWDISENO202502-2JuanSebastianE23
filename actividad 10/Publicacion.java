// actividad 10
public class Publicacion {
    protected int codigo;
    protected String titulo;
    protected int anoPublicacion;

    public Publicacion(int codigo, String titulo, int anoPublicacion) {
        this.codigo = codigo;
        this.titulo = titulo;
        this.anoPublicacion = anoPublicacion;
    }

    public int getAnoPublicacion() {
        return anoPublicacion;
    }

    public int getCodigo() {
        return codigo;
    }

    @Override
    public String toString() {
        return "Código: " + codigo + ", Título: " + titulo + ", Año: " + anoPublicacion;
    }
}