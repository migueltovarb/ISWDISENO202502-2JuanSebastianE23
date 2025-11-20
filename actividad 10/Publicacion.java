public class Publicacion {
    protected String titulo;
    protected int anio;
    protected boolean prestado;

    public Publicacion(String titulo, int anio) {
        this.titulo = titulo;
        this.anio = anio;
        this.prestado = false;
    }

    public void mostrarInformacion() {
        System.out.println("Título: " + titulo + ", Año: " + anio + ", Prestado: " + (prestado ? "Sí" : "No"));
    }

    // Getters
    public String getTitulo() {
        return titulo;
    }

    public int getAnio() {
        return anio;
    }

    public boolean isPrestado() {
        return prestado;
    }
}