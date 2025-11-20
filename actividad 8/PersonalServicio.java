public class PersonalServicio extends Empleado {
    private String seccion;

    public PersonalServicio(String nombre, String apellido, String id, String estadoCivil, String departamento, int anioIncorporacion, int numeroDespacho, double sueldo, String seccion) {
        super(nombre, apellido, id, estadoCivil, departamento, anioIncorporacion, numeroDespacho, sueldo);
        this.seccion = seccion;
    }

    public void cambiarSeccion(String nuevaSeccion) {
        this.seccion = nuevaSeccion;
    }

    @Override
    public void mostrarInformacion() {
        super.mostrarInformacion();
        System.out.println("Sección: " + seccion);
    }

    // Getters
    public String getSeccion() {
        return seccion;
    }
}