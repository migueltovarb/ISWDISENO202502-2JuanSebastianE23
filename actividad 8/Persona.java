public class Persona {
    protected String nombre;
    protected String apellido;
    protected String id;
    protected String estadoCivil;

    public Persona(String nombre, String apellido, String id, String estadoCivil) {
        this.nombre = nombre;
        this.apellido = apellido;
        this.id = id;
        this.estadoCivil = estadoCivil;
    }

    public void mostrarInformacion() {
        System.out.println("Nombre: " + nombre + " " + apellido + ", ID: " + id + ", Estado Civil: " + estadoCivil);
    }

    public void cambiarEstadoCivil(String nuevoEstado) {
        this.estadoCivil = nuevoEstado;
    }

    // Getters
    public String getNombre() {
        return nombre;
    }

    public String getApellido() {
        return apellido;
    }
}