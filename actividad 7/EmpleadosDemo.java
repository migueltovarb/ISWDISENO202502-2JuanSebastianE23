public class EmpleadosDemo {
    public static void main(String[] args) {
        Secretario sec = new Secretario("Ana", "Lopez", "12345678A", 1500, "Despacho 1", "123-456");
        Vendedor ven = new Vendedor("Juan", "Perez", "87654321B", 1200, "ABC123", "Toyota", "Corolla", "600123456", "Madrid", 5.0);
        JefeZona jefe = new JefeZona("Carlos", "Garcia", "11223344C", 2000, "Despacho 2", sec, "DEF456", 1600);

        System.out.println("Secretario:");
        sec.mostrarInformacion();

        System.out.println("\nVendedor:");
        ven.mostrarInformacion();

        System.out.println("\nJefe de Zona:");
        jefe.mostrarInformacion();
    }
}