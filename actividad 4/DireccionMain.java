public class DireccionMain {
    public static void main(String[] args) {
        Nombre nombre = new Nombre("Juan", "Perez");
        Direccion direccion = new Direccion("Calle 123", "Bogota", "110111");

        System.out.println("Nombre: " + nombre.getNombreCompleto());
        System.out.println("Dirección: " + direccion.getDireccionCompleta());
    }
}