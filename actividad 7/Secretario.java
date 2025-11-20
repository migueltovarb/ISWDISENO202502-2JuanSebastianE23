public class Secretario extends Empleado {
    private String despacho;
    private String fax;

    public Secretario(String nombre, String apellido, String dni, double sueldo, String despacho, String fax) {
        super(nombre, apellido, dni, sueldo);
        this.despacho = despacho;
        this.fax = fax;
    }

    @Override
    public void mostrarInformacion() {
        super.mostrarInformacion();
        System.out.println("Despacho: " + despacho + ", Fax: " + fax);
    }

    public void incrementarSueldo(double incremento) {
        this.sueldo += incremento;
    }
}