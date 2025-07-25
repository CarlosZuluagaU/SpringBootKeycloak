package com.api.rest.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

    @GetMapping("/hello-1")
    // Corregido: El nombre del rol debe estar en minúsculas para coincidir con el token.
    @PreAuthorize("hasRole('admin_client_role')")
    public String helloAdmin() {
        return "Hello Spring With Keycloak - Admin";
    }

    @GetMapping("/hello-2")
    // Corregido: Ambos roles en minúsculas.
    @PreAuthorize("hasRole('user_client_role') or hasRole('admin_client_role')")
    public String helloUser() {
        return "Hello Spring With Keycloak - USER OR ADMIN";
    }

}
