public class InterfazDemo {
    public static void main(String[] args) {
        IVehiculo auto = new Auto("Toyota", 200);
        auto.conducir();
        auto.frenar();
        System.out.println("Velocidad máxima: " + auto.obtenerVelocidadMaxima());
    }
}