public class Coche extends Vehiculo {
    private int plazas;

    public Coche(String matricula, int diasAlquiler, int plazas) {
        super(matricula, diasAlquiler);
        this.plazas = plazas;
    }

    @Override
    public double calcularPrecioAlquiler() {
        return 50 * diasAlquiler + 1.5 * plazas * diasAlquiler;
    }

    public int getPlazas() {
        return plazas;
    }
}