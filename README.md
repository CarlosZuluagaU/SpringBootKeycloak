# API REST de Gestión de Usuarios con Spring Boot y Keycloak

![Java](https://img.shields.io/badge/Java-17-blue)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.5-brightgreen)
![Keycloak](https://img.shields.io/badge/Keycloak-24.0.4-yellow)
![Maven](https://img.shields.io/badge/Maven-4.0.0-red)

Este proyecto es una API RESTful desarrollada con Spring Boot que demuestra una integración de seguridad robusta con **Keycloak** como servidor de identidad y autorización. La API permite realizar operaciones CRUD (Crear, Leer, Actualizar y Eliminar) sobre los usuarios de un realm de Keycloak, protegiendo los endpoints mediante roles y tokens JWT.

---

## ✨ Características Principales

-   **Seguridad Basada en Tokens:** Toda la API está protegida usando OAuth 2.0 y JSON Web Tokens (JWT) emitidos por Keycloak.
-   **Autorización Basada en Roles:** Los endpoints están restringidos a usuarios con roles específicos (ej. `admin_client_role`).
-   **Gestión de Usuarios Completa:** Implementación de los siguientes endpoints para administrar usuarios en Keycloak:
    -   `GET /all`: Listar todos los usuarios.
    -   `GET /search/{username}`: Buscar un usuario por su nombre.
    -   `POST /create`: Crear un nuevo usuario.
    -   `PUT /update/{userId}`: Actualizar la información de un usuario.
    -   `DELETE /delete/{userId}`: Eliminar un usuario.
-   **Cliente de Administración de Keycloak:** Uso del `keycloak-admin-client` para interactuar con la API de administración de Keycloak de forma segura desde el backend.

---

## 🛠️ Tecnologías Utilizadas

-   **Backend:** Java 17, Spring Boot 3.2.5
-   **Seguridad:** Spring Security 6, Keycloak 24.0.4
-   **Dependencias:** Maven
-   **Base de Datos de Identidad:** Keycloak (usando su base de datos interna)

---

## 🚀 Cómo Ponerlo en Marcha

### 1. Prerrequisitos

-   Java 17 o superior.
-   Maven 3.8 o superior.
-   Docker y Docker Compose (recomendado para levantar Keycloak).
-   Una herramienta para probar APIs como [Postman](https://www.postman.com/).

### 2. Configuración de Keycloak

1.  **Levantar Keycloak:**
    ```bash
    docker run -p 9090:8080 -e KEYCLOAK_ADMIN=admin -e KEYCLOAK_ADMIN_PASSWORD=admin quay.io/keycloak/keycloak:24.0.4 start-dev
    ```
    Accede a la consola en `http://localhost:9090` con el usuario `admin` y contraseña `admin`.

2.  **Crear el Realm:**
    -   Crea un nuevo realm llamado `spring-boot-realm-dev`.

3.  **Crear el Cliente de API:**
    -   Dentro del realm, ve a `Clients` y crea un nuevo cliente.
    -   **Client ID:** `spring-client-api-rest`
    -   **Client authentication:** `On`
    -   **Service accounts roles:** `On`
    -   Guarda y ve a la pestaña `Credentials` para copiar el **Client Secret**.

4.  **Crear los Roles:**
    -   Ve a `Client scopes` -> `spring-client-api-rest-dedicated`.
    -   En la pestaña `Scope`, crea los roles: `admin_client_role` y `user_client_role`.

5.  **Crear un Usuario de Prueba:**
    -   Ve a `Users` y crea un usuario (ej. `isa`).
    -   En la pestaña `Credentials`, asígnale una contraseña.
    -   En la pestaña `Role mappings`, asígnale el rol `admin_client_role`.

### 3. Configuración de la Aplicación Spring Boot

1.  **Clona el repositorio:**
    ```bash
    git clone <URL-DE-TU-REPOSITORIO>
    cd SpringBootKeicloak
    ```

2.  **Configura `application.properties`:**
    -   Abre `src/main/resources/application.properties`.
    -   Asegúrate de que las propiedades coincidan con tu configuración de Keycloak, especialmente el `keycloak.client-secret`.

    ```properties
    spring.security.oauth2.resourceserver.jwt.issuer-uri=http://localhost:9090/realms/spring-boot-realm-dev

    jwt.auth.convert.resource-id=spring-client-api-rest

    keycloak.server-url=http://localhost:9090
    keycloak.realm=spring-boot-realm-dev
    keycloak.grant-type=client_credentials
    keycloak.client-id=spring-client-api-rest
    keycloak.client-secret=TU_SECRET_AQUI
    ```

3.  **Ejecuta la aplicación:**
    ```bash
    mvn spring-boot:run
    ```
    La API estará disponible en `http://localhost:8080`.

---

## ⚙️ Documentación de la API

Todas las peticiones requieren un **Bearer Token** en la cabecera de autorización. El token debe ser de un usuario con el rol `admin_client_role`.

| Método   | Endpoint                          | Descripción                 | Body de Ejemplo (JSON)                                                                    |
| :------- | :-------------------------------- | :-------------------------- | :---------------------------------------------------------------------------------------- |
| `GET`    | `/keycloak/user/all`              | Lista todos los usuarios.   | N/A                                                                                       |
| `POST`   | `/keycloak/user/create`           | Crea un nuevo usuario.      | `{"username": "nuevo", "password": "pass123", "email": "nuevo@mail.com", "firstName": "Nuevo"}` |
| `GET`    | `/keycloak/user/search/{username}`| Busca un usuario.           | N/A                                                                                       |
| `PUT`    | `/keycloak/user/update/{userId}`  | Actualiza un usuario.       | `{"firstName": "NombreActualizado", "lastName": "ApellidoActualizado"}`                   |
| `DELETE` | `/keycloak/user/delete/{userId}`  | Elimina un usuario.         | N/A                                                                                       |

---

## 👤 Contacto

Carlos Andrés Zuluaga Amaya

-   **LinkedIn:** www.linkedin.com/in/carlos-andres-zuluaga-699296307
-   **GitHub:** [https://pages.github.com/](https://github.com/CarlosZuluagaU) 
