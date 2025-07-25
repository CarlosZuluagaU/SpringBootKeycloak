package com.api.rest.service.Impl;

import com.api.rest.DTOs.UserDTO;
import com.api.rest.service.IkeycloakService;
import jakarta.ws.rs.NotFoundException;
import jakarta.ws.rs.core.Response;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.resource.UserResource;
import org.keycloak.admin.client.resource.UsersResource;
import org.keycloak.representations.idm.CredentialRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor // Crea un constructor para los campos 'final'.
@Slf4j // Inyecta un objeto 'log' para registrar información y errores.
public class KeycloakServiceImpl implements IkeycloakService {

    // Inyección por constructor: más seguro y recomendado.
    private final Keycloak keycloak;

    @Value("${keycloak.realm}")
    private String realm;

    @Override
    public List<UserRepresentation> findAllUsers() {
        return keycloak.realm(realm).users().list();
    }

    @Override
    public List<UserRepresentation> searchUserByUsername(String username) {
        return keycloak.realm(realm).users().searchByUsername(username, true);
    }

    private UsersResource getUsersResource() {
        return keycloak.realm(realm).users();
    }

    @Override
    public String createUser(UserDTO userDTO) {
        // La anotación @NotNull que tenías antes no tiene efecto aquí.
        // Es mejor hacer la validación manualmente.
        if (userDTO == null || userDTO.getUsername() == null || userDTO.getPassword() == null) {
            log.warn("Intento de crear usuario con datos inválidos.");
            return "Error: El nombre de usuario y la contraseña son obligatorios.";
        }

        CredentialRepresentation credential = new CredentialRepresentation();
        credential.setTemporary(false);
        credential.setType(CredentialRepresentation.PASSWORD);
        credential.setValue(userDTO.getPassword());

        UserRepresentation user = new UserRepresentation();
        user.setUsername(userDTO.getUsername());
        user.setEmail(userDTO.getEmail());
        user.setFirstName(userDTO.getFirstName());
        user.setLastName(userDTO.getLastName());
        user.setEmailVerified(true);
        user.setEnabled(true);
        user.setCredentials(Collections.singletonList(credential));

        try (Response response = getUsersResource().create(user)) {
            if (response.getStatus() == 201) {
                String path = response.getLocation().getPath();
                String userId = path.substring(path.lastIndexOf('/') + 1);
                log.info("Usuario creado exitosamente con ID: {}", userId);
                return "Usuario creado con ID: " + userId;
            } else if (response.getStatus() == 409) {
                log.warn("Conflicto al crear usuario '{}': ya existe.", userDTO.getUsername());
                return "Error: El usuario ya existe.";
            } else {
                String errorDetails = response.readEntity(String.class);
                log.error("Error inesperado al crear usuario. Status: {}, Razón: {}, Detalles: {}",
                        response.getStatus(), response.getStatusInfo().getReasonPhrase(), errorDetails);
                return "Error al crear usuario. Consulte los logs del servidor.";
            }
        } catch (Exception e) {
            log.error("Excepción inesperada al crear el usuario '{}'", userDTO.getUsername(), e);
            return "Error interno del servidor. Por favor, contacte al administrador.";
        }
    }

    @Override
    public void updateUser(String userId, UserDTO userDTO) {
        try {
            UserResource userResource = keycloak.realm(realm).users().get(userId);
            UserRepresentation user = userResource.toRepresentation();

            user.setFirstName(userDTO.getFirstName());
            user.setLastName(userDTO.getLastName());
            user.setEmail(userDTO.getEmail());
            user.setUsername(userDTO.getUsername());

            userResource.update(user);
            log.info("Usuario con ID {} actualizado exitosamente.", userId);
        } catch (NotFoundException e) {
            log.error("No se pudo actualizar: Usuario con ID '{}' no encontrado.", userId, e);
            // En un caso real, aquí lanzarías una excepción personalizada
            // para que un @ControllerAdvice la maneje y devuelva un error 404.
        } catch (Exception e) {
            log.error("Error inesperado al actualizar el usuario con ID: {}", userId, e);
        }
    }
    @Override
    public void deleteUser(String userId) {
        try {
            keycloak.realm(realm).users().delete(userId);
            log.info("Usuario con ID {} eliminado exitosamente.", userId);
        } catch (NotFoundException e) {
            log.error("No se pudo eliminar: Usuario con ID '{}' no encontrado.", userId, e);
        } catch (Exception e) {
            log.error("Error inesperado al eliminar el usuario con ID: {}", userId, e);
        }
    }
}
