public class Auto implements IVehiculo {
    private String marca;
    private double velocidadMaxima;

    public Auto(String marca, double velocidadMaxima) {
        this.marca = marca;
        this.velocidadMaxima = velocidadMaxima;
    }

    @Override
    public void conducir() {
        System.out.println("Conduciendo el auto " + marca);
    }

    @Override
    public void frenar() {
        System.out.println("Frenando el auto " + marca);
    }

    @Override
    public double obtenerVelocidadMaxima() {
        return velocidadMaxima;
    }
}