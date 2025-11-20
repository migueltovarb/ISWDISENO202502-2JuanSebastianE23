public class FacultadDemo {
    public static void main(String[] args) {
        Estudiante estudiante = new Estudiante("Juan", "Perez", "123", "Soltero", "Ingeniería", "A", true);
        Profesor profesor = new Profesor("Ana", "Gomez", "456", "Casada", "Matemáticas", 2010, 101, 3000.0, "Álgebra");
        PersonalServicio personal = new PersonalServicio("Luis", "Rodriguez", "789", "Soltero", "Administración", 2015, 202, 1500.0, "Limpieza");

        System.out.println("Estudiante:");
        estudiante.mostrarInformacion();

        System.out.println("\nProfesor:");
        profesor.mostrarInformacion();

        System.out.println("\nPersonal de Servicio:");
        personal.mostrarInformacion();

        // Cambiar estado civil
        estudiante.cambiarEstadoCivil("Casado");
        profesor.cambiarDespacho(102);
        personal.cambiarSeccion("Mantenimiento");

        System.out.println("\nDespués de cambios:");
        estudiante.mostrarInformacion();
        profesor.mostrarInformacion();
        personal.mostrarInformacion();
    }
}