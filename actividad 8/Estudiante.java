public class Estudiante extends Persona {
    private String curso;
    private String grupo;
    private boolean beca;

    public Estudiante(String nombre, String apellido, String id, String estadoCivil, String curso, String grupo, boolean beca) {
        super(nombre, apellido, id, estadoCivil);
        this.curso = curso;
        this.grupo = grupo;
        this.beca = beca;
    }

    public void cambiarCurso(String nuevoCurso) {
        this.curso = nuevoCurso;
    }

    public void cambiarGrupo(String nuevoGrupo) {
        this.grupo = nuevoGrupo;
    }

    @Override
    public void mostrarInformacion() {
        super.mostrarInformacion();
        System.out.println("Curso: " + curso + ", Grupo: " + grupo + ", Beca: " + (beca ? "Sí" : "No"));
    }

    // Getters
    public String getCurso() {
        return curso;
    }

    public String getGrupo() {
        return grupo;
    }

    public boolean isBeca() {
        return beca;
    }
}