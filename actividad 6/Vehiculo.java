public abstract class Vehiculo {
    protected String matricula;
    protected int diasAlquiler;

    public Vehiculo(String matricula, int diasAlquiler) {
        this.matricula = matricula;
        this.diasAlquiler = diasAlquiler;
    }

    public abstract double calcularPrecioAlquiler();

    public String getMatricula() {
        return matricula;
    }

    public int getDiasAlquiler() {
        return diasAlquiler;
    }
}