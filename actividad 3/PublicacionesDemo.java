public class PublicacionesDemo {
    public static void main(String[] args) {
        Publicacion libro = new Libro("El Quijote", 20.0, "Cervantes", 1000);
        Publicacion disco = new Disco("Thriller", 15.0, "Michael Jackson", 42);

        libro.mostrar();
        disco.mostrar();
    }
}