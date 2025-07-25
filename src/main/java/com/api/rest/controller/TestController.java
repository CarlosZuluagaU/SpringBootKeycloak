package com.api.rest.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

    @GetMapping("/hello-1")
    @PreAuthorize("hasRole('ADMIN_CLIENT_ROLE')") //
    public String helloAdmin() {
        return "Hello Spring With Keycloak - Admin";
    }

    @GetMapping("/hello-2")
    @PreAuthorize("hasRole('USER_CLIENT_ROLE') or hasRole('ADMIN_CLIENT_ROLE')")
    public String helloUser() {
        return "Hello Spring With Keycloak - USER OR ADMIN";
    }

}
