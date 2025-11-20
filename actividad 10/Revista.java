public class Revista extends Publicacion implements Prestable {
    private int numero;

    public Revista(String titulo, int anio, int numero) {
        super(titulo, anio);
        this.numero = numero;
    }

    @Override
    public void prestar() {
        if (!prestado) {
            prestado = true;
            System.out.println("Revista prestada.");
        } else {
            System.out.println("La revista ya está prestada.");
        }
    }

    @Override
    public void devolver() {
        if (prestado) {
            prestado = false;
            System.out.println("Revista devuelta.");
        } else {
            System.out.println("La revista no estaba prestada.");
        }
    }

    @Override
    public boolean estaPrestado() {
        return prestado;
    }

    @Override
    public void mostrarInformacion() {
        super.mostrarInformacion();
        System.out.println("Número: " + numero);
    }

    // Getter
    public int getNumero() {
        return numero;
    }
}