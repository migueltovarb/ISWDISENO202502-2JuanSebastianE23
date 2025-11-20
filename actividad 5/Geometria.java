public class Geometria {
    public static void main(String[] args) {
        Circulo circulo = new Circulo(5);
        System.out.println("Área círculo: " + circulo.calcularArea());
        System.out.println("Perímetro círculo: " + circulo.calcularPerimetro());

        Cilindro cilindro = new Cilindro(5, 10);
        System.out.println("Volumen cilindro: " + cilindro.calcularVolumen());
        System.out.println("Área superficial cilindro: " + cilindro.calcularAreaSuperficial());

        CilindroHueco hueco = new CilindroHueco(5, 3, 10);
        System.out.println("Volumen cilindro hueco: " + hueco.calcularVolumen());
        System.out.println("Área superficial cilindro hueco: " + hueco.calcularAreaSuperficial());
    }
}