package com.api.rest.controller;

import com.api.rest.DTOs.UserDTO;
import com.api.rest.service.IkeycloakService;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/keycloak/user")
@PreAuthorize("hasRole('admin_client_role')")
public class KeycloakController {

    @Autowired
    private IkeycloakService keycloakService;

    @GetMapping("/all")
    public ResponseEntity<List<UserRepresentation>> findAllUsers() {
        return ResponseEntity.ok(keycloakService.findAllUsers());
    }

    @GetMapping("/search/{username}")
    public ResponseEntity<List<UserRepresentation>> searchUser(@PathVariable String username) {
        return ResponseEntity.ok(keycloakService.searchUserByUsername(username));
    }

    @PostMapping("/create")
    public ResponseEntity<String> createUser(@RequestBody UserDTO userDTO) {
        String response = keycloakService.createUser(userDTO);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/update/{userId}")
    public ResponseEntity<String> updateUser(@PathVariable String userId, @RequestBody UserDTO userDTO) {
        keycloakService.updateUser(userId, userDTO);
        return ResponseEntity.ok("User updated successfully");
    }

    @DeleteMapping("/delete/{userId}")
    public ResponseEntity<String> deleteUser(@PathVariable String userId) {
        keycloakService.deleteUser(userId);
        return ResponseEntity.ok("User deleted successfully");
    }
}
