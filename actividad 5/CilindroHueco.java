public class CilindroHueco extends Cilindro {
    private double radioInterno;

    public CilindroHueco(double radioExterno, double radioInterno, double altura) {
        super(radioExterno, altura);
        this.radioInterno = radioInterno;
    }

    @Override
    public double calcularVolumen() {
        double areaExterna = Math.PI * radio * radio;
        double areaInterna = Math.PI * radioInterno * radioInterno;
        return (areaExterna - areaInterna) * getAltura();
    }

    @Override
    public double calcularAreaSuperficial() {
        double perimetroExterno = 2 * Math.PI * radio;
        double perimetroInterno = 2 * Math.PI * radioInterno;
        double areaLateral = (perimetroExterno + perimetroInterno) * getAltura();
        double areaSuperior = Math.PI * (radio * radio - radioInterno * radioInterno);
        return areaLateral + 2 * areaSuperior;
    }

    public double getRadioInterno() {
        return radioInterno;
    }
}