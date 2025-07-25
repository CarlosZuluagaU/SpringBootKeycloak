package com.api.rest.DTOs;

import lombok.Builder;
import lombok.Value;
import java.util.Set;

/**
 * DTO inmutable para representar los datos de un usuario.
 * Ideal para contextos de alta seguridad como la interacción con Keycloak.
 *
 * @Value: Es una anotación de Lombok que agrupa varias otras.
 * Hace que todos los campos sean 'private' y 'final' por defecto.
 * Genera getters para todos los campos (pero no setters).
 * Genera métodos 'toString()', 'equals()', 'hashCode()' y un constructor
 * que recibe todos los argumentos.
 *
 * @Builder: Implementa el patrón de diseño "Builder", permitiendo una
 * creación de objetos fluida y legible, sin necesidad de un
 * constructor con una larga lista de parámetros.
 */
@Value
@Builder
public class UserDTO {

    String username;
    String email;
    String firstName;
    String lastName;
    String password;
    Set<String> roles;

}
