// Interfaz para los carros
interface Carro {
    void conducir();
}

// Clase concreta para un carro deportivo
class CarroDeportivo implements Carro {
    @Override
    public void conducir() {
        System.out.println("Conduciendo un carro deportivo a alta velocidad.");
    }
}

// Clase concreta para un carro familiar
class CarroFamiliar implements Carro {
    @Override
    public void conducir() {
        System.out.println("Conduciendo un carro familiar con comodidad.");
    }
}

// Clase concreta para un carro eléctrico
class CarroElectrico implements Carro {
    @Override
    public void conducir() {
        System.out.println("Conduciendo un carro eléctrico de manera silenciosa.");
    }
}

// Fábrica para crear carros
class FabricaCarros {
    // Método para crear carros basado en el tipo
    public Carro crearCarro(String tipo) {
        switch (tipo.toLowerCase()) {
            case "deportivo":
                return new CarroDeportivo();
            case "familiar":
                return new CarroFamiliar();
            case "electrico":
                return new CarroElectrico();
            default:
                throw new IllegalArgumentException("Tipo de carro desconocido: " + tipo);
        }
    }
}

// Clase principal para demostrar el uso de la fábrica
public class FabricaCarrosDemo {
    public static void main(String[] args) {
        FabricaCarros fabrica = new FabricaCarros();

        // Crear diferentes tipos de carros
        Carro deportivo = fabrica.crearCarro("deportivo");
        Carro familiar = fabrica.crearCarro("familiar");
        Carro electrico = fabrica.crearCarro("electrico");

        // Usar los carros
        deportivo.conducir();
        familiar.conducir();
        electrico.conducir();
    }
}