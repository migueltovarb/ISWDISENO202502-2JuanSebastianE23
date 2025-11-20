public class Profesor extends Empleado {
    private String especialidad;

    public Profesor(String nombre, String apellido, String id, String estadoCivil, String departamento, int anioIncorporacion, int numeroDespacho, double sueldo, String especialidad) {
        super(nombre, apellido, id, estadoCivil, departamento, anioIncorporacion, numeroDespacho, sueldo);
        this.especialidad = especialidad;
    }

    @Override
    public void mostrarInformacion() {
        super.mostrarInformacion();
        System.out.println("Especialidad: " + especialidad);
    }

    // Getters
    public String getEspecialidad() {
        return especialidad;
    }
}