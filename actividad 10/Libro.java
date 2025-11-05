// actividad 10
public class Libro extends Publicacion implements Prestable {
    private boolean prestado;

    public Libro(int codigo, String titulo, int anoPublicacion) {
        super(codigo, titulo, anoPublicacion);
        this.prestado = false;
    }

    @Override
    public void prestar() {
        this.prestado = true;
    }

    @Override
    public void devolver() {
        this.prestado = false;
    }

    @Override
    public boolean prestado() {
        return this.prestado;
    }

    @Override
    public String toString() {
        return super.toString() + ", Prestado: " + prestado;
    }
}