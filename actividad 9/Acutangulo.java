public class Acutangulo extends TrianguloBase {
    public Acutangulo(double lado1, double lado2, double lado3) {
        super(lado1, lado2, lado3);
    }

    @Override
    public String tipoTriangulo() {
        return "Acutángulo";
    }
}