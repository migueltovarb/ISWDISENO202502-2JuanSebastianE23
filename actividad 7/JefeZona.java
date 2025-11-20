public class JefeZona extends Empleado {
    private String despacho;
    private Secretario secretario;
    private String matriculaCoche;
    private double sueldoSecretario;

    public JefeZona(String nombre, String apellido, String dni, double sueldo, String despacho, Secretario secretario, String matriculaCoche, double sueldoSecretario) {
        super(nombre, apellido, dni, sueldo);
        this.despacho = despacho;
        this.secretario = secretario;
        this.matriculaCoche = matriculaCoche;
        this.sueldoSecretario = sueldoSecretario;
    }

    @Override
    public void mostrarInformacion() {
        super.mostrarInformacion();
        System.out.println("Despacho: " + despacho + ", Coche: " + matriculaCoche + ", Sueldo Secretario: " + sueldoSecretario);
        if (secretario != null) {
            System.out.println("Secretario:");
            secretario.mostrarInformacion();
        }
    }

    public void cambiarSecretario(Secretario nuevoSecretario) {
        this.secretario = nuevoSecretario;
    }

    public void cambiarSueldoSecretario(double nuevoSueldo) {
        this.sueldoSecretario = nuevoSueldo;
    }
}