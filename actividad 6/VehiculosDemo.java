public class VehiculosDemo {
    public static void main(String[] args) {
        Coche coche = new Coche("ABC123", 5, 4);
        System.out.println("Precio alquiler coche: " + coche.calcularPrecioAlquiler());

        Camion camion = new Camion("DEF456", 3, 2000);
        Remolque remolque = new Remolque(500);
        camion.ponRemolque(remolque);
        System.out.println("Precio alquiler camion: " + camion.calcularPrecioAlquiler());

        camion.quitaRemolque();
        System.out.println("Precio alquiler camion sin remolque: " + camion.calcularPrecioAlquiler());
    }
}