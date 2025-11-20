public class Circulo {
    private double radio;

    // Constructor para inicializar el radio
    public Circulo(double radio) {
        this.radio = radio;
    }

    // Método para calcular el área del círculo
    public double calcularArea() {
        return Math.PI * radio * radio;
    }

    // Método para calcular el perímetro del círculo
    public double calcularPerimetro() {
        return 2 * Math.PI * radio;
    }

    // Método para obtener el radio
    public double getRadio() {
        return radio;
    }

    // Método para establecer el radio
    public void setRadio(double radio) {
        this.radio = radio;
    }
}