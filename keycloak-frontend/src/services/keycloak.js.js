import Keycloak from 'keycloak-js';

// Configuración del cliente PÚBLICO que creamos para el frontend.
const keycloak = new Keycloak({
  url: 'http://localhost:9090',
  realm: 'spring-boot-realm-dev',
  clientId: 'frontend-app',
});

export default keycloak;