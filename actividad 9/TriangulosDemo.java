public class TriangulosDemo {
    public static void main(String[] args) {
        TrianguloBase esc = new Escaleno(3, 4, 5);
        TrianguloBase acu = new Acutangulo(5, 5, 6);

        System.out.println("Escaleno: " + esc.tipoTriangulo() + ", Área: " + esc.calcularArea() + ", Perímetro: " + esc.calcularPerimetro());
        System.out.println("Acutángulo: " + acu.tipoTriangulo() + ", Área: " + acu.calcularArea() + ", Perímetro: " + acu.calcularPerimetro());
    }
}