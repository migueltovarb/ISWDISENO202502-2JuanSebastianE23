// actividad 10
public class Revista extends Publicacion {
    private int numero;

    public Revista(int codigo, String titulo, int anoPublicacion, int numero) {
        super(codigo, titulo, anoPublicacion);
        this.numero = numero;
    }

    @Override
    public String toString() {
        return super.toString() + ", Número: " + numero;
    }
}