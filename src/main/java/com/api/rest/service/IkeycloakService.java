package com.api.rest.service;

import com.api.rest.DTOs.UserDTO;
import org.keycloak.admin.client.resource.UsersResource;
import org.keycloak.representations.idm.UserRepresentation;

import java.util.List;

public interface IkeycloakService {



    List<UserRepresentation> findAllUsers();
    List<UserRepresentation> searchUserByUsername(String username);
    String createUser(UserDTO userDTO);
    void updateUser(String userId, UserDTO userDTO);
    void deleteUser(String userId);
}


