// actividad 10
public class BibliotecaDemo {
    public static void main(String[] args) {
        // Crear libro
        Libro libro = new Libro(1, "Java Programming", 2023);
        System.out.println("Libro creado: " + libro);

        // Crear revista
        Revista revista = new Revista(2, "Tech Magazine", 2023, 45);
        System.out.println("Revista creada: " + revista);

        // Operaciones con libro
        System.out.println("\n=== OPERACIONES CON LIBRO ===");
        System.out.println("¿Está prestado? " + libro.prestado());

        libro.prestar();
        System.out.println("Después de prestar: " + libro);
        System.out.println("¿Está prestado? " + libro.prestado());

        libro.devolver();
        System.out.println("Después de devolver: " + libro);
        System.out.println("¿Está prestado? " + libro.prestado());

        // Mostrar información adicional
        System.out.println("\nAño de publicación del libro: " + libro.getAnoPublicacion());
        System.out.println("Código del libro: " + libro.getCodigo());
        System.out.println("Año de publicación de la revista: " + revista.getAnoPublicacion());
        System.out.println("Código de la revista: " + revista.getCodigo());
    }
}