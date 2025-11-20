public class CorreccionInterfaz {
    public static void main(String[] args) {
        Revista revista = new Revista("National Geographic", 2023, 150);

        revista.mostrarInformacion();
        System.out.println("¿Está prestada? " + revista.estaPrestado());

        revista.prestar();
        revista.mostrarInformacion();
        System.out.println("¿Está prestada? " + revista.estaPrestado());

        revista.devolver();
        revista.mostrarInformacion();
        System.out.println("¿Está prestada? " + revista.estaPrestado());
    }
}