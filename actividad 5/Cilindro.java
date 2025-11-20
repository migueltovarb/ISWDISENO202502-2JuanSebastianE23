public class Cilindro extends Circulo {
    private double altura;

    public Cilindro(double radio, double altura) {
        super(radio);
        this.altura = altura;
    }

    public double calcularVolumen() {
        return calcularArea() * altura;
    }

    public double calcularAreaSuperficial() {
        return 2 * calcularArea() + calcularPerimetro() * altura;
    }

    public double getAltura() {
        return altura;
    }
}