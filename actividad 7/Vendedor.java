public class Vendedor extends Empleado {
    private String matriculaCoche;
    private String marcaCoche;
    private String modeloCoche;
    private String telefonoMovil;
    private String areaVenta;
    private double porcentajeComision;

    public Vendedor(String nombre, String apellido, String dni, double sueldo, String matriculaCoche, String marcaCoche, String modeloCoche, String telefonoMovil, String areaVenta, double porcentajeComision) {
        super(nombre, apellido, dni, sueldo);
        this.matriculaCoche = matriculaCoche;
        this.marcaCoche = marcaCoche;
        this.modeloCoche = modeloCoche;
        this.telefonoMovil = telefonoMovil;
        this.areaVenta = areaVenta;
        this.porcentajeComision = porcentajeComision;
    }

    @Override
    public void mostrarInformacion() {
        super.mostrarInformacion();
        System.out.println("Coche: " + marcaCoche + " " + modeloCoche + " (" + matriculaCoche + "), Tel: " + telefonoMovil + ", Area: " + areaVenta + ", Comision: " + porcentajeComision + "%");
    }

    public void cambiarCoche(String matricula, String marca, String modelo) {
        this.matriculaCoche = matricula;
        this.marcaCoche = marca;
        this.modeloCoche = modelo;
    }
}