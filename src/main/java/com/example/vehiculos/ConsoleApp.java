package com.example.vehiculos;

import com.example.vehiculos.model.Vehicle;
import com.example.vehiculos.service.VehicleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Scanner;

@Component
public class ConsoleApp implements CommandLineRunner {

    @Autowired
    private VehicleService vehicleService;

    @Override
    public void run(String... args) throws Exception {
        Scanner scanner = new Scanner(System.in);
        boolean running = true;

        while (running) {
            System.out.println("\n=== CRUD de Vehículos ===");
            System.out.println("1. Agregar vehículo");
            System.out.println("2. Listar vehículos");
            System.out.println("3. Actualizar vehículo");
            System.out.println("4. Eliminar vehículo");
            System.out.println("5. Salir");
            System.out.print("Selecciona una opción: ");

            int option = scanner.nextInt();
            scanner.nextLine(); // consume newline

            switch (option) {
                case 1:
                    addVehicle(scanner);
                    break;
                case 2:
                    listVehicles();
                    break;
                case 3:
                    updateVehicle(scanner);
                    break;
                case 4:
                    deleteVehicle(scanner);
                    break;
                case 5:
                    running = false;
                    System.out.println("Saliendo...");
                    break;
                default:
                    System.out.println("Opción inválida.");
            }
        }
    }

    private void addVehicle(Scanner scanner) {
        System.out.print("Marca: ");
        String marca = scanner.nextLine();
        System.out.print("Modelo: ");
        String modelo = scanner.nextLine();
        System.out.print("Año: ");
        int anio = scanner.nextInt();
        scanner.nextLine(); // consume newline
        System.out.print("Precio: ");
        String precioStr = scanner.nextLine().replace("$", "").replace(".", "").replace(",", "");
        double precio = Double.parseDouble(precioStr);

        Vehicle vehicle = new Vehicle(marca, modelo, anio, precio);
        try {
            Vehicle saved = vehicleService.save(vehicle);
            System.out.println("Vehículo guardado con ID: " + saved.getId());
        } catch (Exception e) {
            System.out.println("Error al guardar el vehículo: " + e.getMessage());
        }
    }

    private void listVehicles() {
        List<Vehicle> vehicles = vehicleService.findAll();
        if (vehicles.isEmpty()) {
            System.out.println("No hay vehículos.");
        } else {
            for (Vehicle v : vehicles) {
                System.out.println(v.getId() + " - " + v.getMarca() + " " + v.getModelo() + " (" + v.getAnio() + ") - $" + v.getPrecio());
            }
        }
    }

    private void updateVehicle(Scanner scanner) {
        listVehicles();
        System.out.print("ID del vehículo a actualizar: ");
        String id = scanner.nextLine();
        Vehicle vehicle = vehicleService.findById(id).orElse(null);
        if (vehicle == null) {
            System.out.println("Vehículo no encontrado.");
            return;
        }

        System.out.print("Nueva marca (" + vehicle.getMarca() + "): ");
        String marca = scanner.nextLine();
        if (!marca.isEmpty()) vehicle.setMarca(marca);

        System.out.print("Nuevo modelo (" + vehicle.getModelo() + "): ");
        String modelo = scanner.nextLine();
        if (!modelo.isEmpty()) vehicle.setModelo(modelo);

        System.out.print("Nuevo año (" + vehicle.getAnio() + "): ");
        String anioStr = scanner.nextLine();
        if (!anioStr.isEmpty()) vehicle.setAnio(Integer.parseInt(anioStr));

        System.out.print("Nuevo precio (" + vehicle.getPrecio() + "): ");
        String precioStr = scanner.nextLine();
        if (!precioStr.isEmpty()) vehicle.setPrecio(Double.parseDouble(precioStr));

        try {
            vehicleService.save(vehicle);
            System.out.println("Vehículo actualizado.");
        } catch (Exception e) {
            System.out.println("Error al actualizar el vehículo: " + e.getMessage());
        }
    }

    private void deleteVehicle(Scanner scanner) {
        listVehicles();
        System.out.print("ID del vehículo a eliminar: ");
        String id = scanner.nextLine();
        try {
            vehicleService.deleteById(id);
            System.out.println("Vehículo eliminado.");
        } catch (Exception e) {
            System.out.println("Error al eliminar el vehículo: " + e.getMessage());
        }
    }
}