public class Empleado {
    protected String nombre;
    protected String apellido;
    protected String dni;
    protected double sueldo;

    public Empleado(String nombre, String apellido, String dni, double sueldo) {
        this.nombre = nombre;
        this.apellido = apellido;
        this.dni = dni;
        this.sueldo = sueldo;
    }

    public void mostrarInformacion() {
        System.out.println("Nombre: " + nombre + " " + apellido + ", DNI: " + dni + ", Sueldo: " + sueldo);
    }

    // Getters
    public String getNombre() {
        return nombre;
    }

    public double getSueldo() {
        return sueldo;
    }
}