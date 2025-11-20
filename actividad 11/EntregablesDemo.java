public class EntregablesDemo {
    public static void main(String[] args) {
        Serie[] series = new Serie[5];
        series[0] = new Serie("Breaking Bad", 5, "Drama", "Vince Gilligan");
        series[1] = new Serie("Game of Thrones", 8, "Fantasía", "George R.R. Martin");
        series[2] = new Serie("The Office", 9, "Comedia", "Greg Daniels");
        series[3] = new Serie("Stranger Things", 4, "Ciencia Ficción", "The Duffer Brothers");
        series[4] = new Serie("The Mandalorian", 2, "Ciencia Ficción", "Jon Favreau");

        Videojuego[] videojuegos = new Videojuego[5];
        videojuegos[0] = new Videojuego("The Last of Us", 20, "Aventura", "Naughty Dog");
        videojuegos[1] = new Videojuego("God of War", 15, "Aventura", "Santa Monica");
        videojuegos[2] = new Videojuego("Uncharted", 12, "Aventura", "Naughty Dog");
        videojuegos[3] = new Videojuego("Horizon Zero Dawn", 18, "RPG", "Guerrilla Games");
        videojuegos[4] = new Videojuego("Spider-Man", 10, "Aventura", "Insomniac Games");

        // Entregar algunos
        series[1].entregar();
        series[3].entregar();
        videojuegos[0].entregar();
        videojuegos[2].entregar();
        videojuegos[4].entregar();

        // Contar entregados
        int seriesEntregadas = 0;
        for (Serie s : series) {
            if (s.isEntregado()) seriesEntregadas++;
        }

        int videojuegosEntregados = 0;
        for (Videojuego v : videojuegos) {
            if (v.isEntregado()) videojuegosEntregados++;
        }

        System.out.println("Series entregadas: " + seriesEntregadas);
        System.out.println("Videojuegos entregados: " + videojuegosEntregados);

        // Encontrar el más largo
        Serie serieMasLarga = series[0];
        for (Serie s : series) {
            if (s.compareTo(serieMasLarga) > 0) serieMasLarga = s;
        }
        System.out.println("Serie con más temporadas: " + serieMasLarga.getTitulo());

        Videojuego videojuegoMasLargo = videojuegos[0];
        for (Videojuego v : videojuegos) {
            if (v.compareTo(videojuegoMasLargo) > 0) videojuegoMasLargo = v;
        }
        System.out.println("Videojuego con más horas: " + videojuegoMasLargo.getTitulo());
    }
}