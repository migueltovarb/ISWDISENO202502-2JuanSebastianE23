public class Empleado extends Persona {
    protected String departamento;
    protected int anioIncorporacion;
    protected int numeroDespacho;
    protected double sueldo;

    public Empleado(String nombre, String apellido, String id, String estadoCivil, String departamento, int anioIncorporacion, int numeroDespacho, double sueldo) {
        super(nombre, apellido, id, estadoCivil);
        this.departamento = departamento;
        this.anioIncorporacion = anioIncorporacion;
        this.numeroDespacho = numeroDespacho;
        this.sueldo = sueldo;
    }

    public void cambiarDespacho(int nuevoDespacho) {
        this.numeroDespacho = nuevoDespacho;
    }

    public void cambiarDepartamento(String nuevoDepartamento) {
        this.departamento = nuevoDepartamento;
    }

    @Override
    public void mostrarInformacion() {
        super.mostrarInformacion();
        System.out.println("Departamento: " + departamento + ", Año de Incorporación: " + anioIncorporacion + ", Número de Despacho: " + numeroDespacho + ", Sueldo: " + sueldo);
    }

    // Getters
    public String getDepartamento() {
        return departamento;
    }

    public int getAnioIncorporacion() {
        return anioIncorporacion;
    }

    public int getNumeroDespacho() {
        return numeroDespacho;
    }

    public double getSueldo() {
        return sueldo;
    }
}