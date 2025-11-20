public class Camion extends Vehiculo {
    private int pma; // peso máximo autorizado
    private Remolque remolque;

    public Camion(String matricula, int diasAlquiler, int pma) {
        super(matricula, diasAlquiler);
        this.pma = pma;
    }

    public void ponRemolque(Remolque remolque) {
        this.remolque = remolque;
    }

    public void quitaRemolque() {
        this.remolque = null;
    }

    @Override
    public double calcularPrecioAlquiler() {
        double precio = 40 * diasAlquiler + 20 * pma;
        if (remolque != null) {
            precio += remolque.getPma() * 10;
        }
        return precio;
    }

    public int getPma() {
        return pma;
    }

    public Remolque getRemolque() {
        return remolque;
    }
}