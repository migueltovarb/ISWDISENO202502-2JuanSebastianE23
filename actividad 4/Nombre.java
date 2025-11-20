public class Nombre {
    private String primerNombre;
    private String apellido;

    public Nombre(String primerNombre, String apellido) {
        this.primerNombre = primerNombre;
        this.apellido = apellido;
    }

    public String getNombreCompleto() {
        return primerNombre + " " + apellido;
    }

    public String getPrimerNombre() {
        return primerNombre;
    }

    public String getApellido() {
        return apellido;
    }
}