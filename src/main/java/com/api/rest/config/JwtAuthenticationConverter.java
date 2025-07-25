package com.api.rest.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.convert.converter.Converter;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Component;

import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Component
public class JwtAuthenticationConverter implements Converter<Jwt, AbstractAuthenticationToken> {

    // Creamos un logger para esta clase
    private static final Logger log = LoggerFactory.getLogger(JwtAuthenticationConverter.class);

    @Value("${jwt.auth.convert.resource-id}")
    private String resourceId;

    @Value("${jwt.auth.convert.principal-attribute}")
    private String principalAttribute;

    @Override
    public AbstractAuthenticationToken convert(Jwt jwt) {
        log.info("==> Iniciando conversión de JWT para el principal: {}", getPrincipalClaimName(jwt));

        Collection<GrantedAuthority> authorities = extractResourceRoles(jwt);

        log.info("==> Authorities finales asignadas: {}", authorities);

        return new JwtAuthenticationToken(
                jwt,
                authorities,
                getPrincipalClaimName(jwt)
        );
    }

    private String getPrincipalClaimName(Jwt jwt) {
        String claimName = principalAttribute;
        if (claimName == null) {
            return jwt.getClaim("sub");
        }
        return jwt.getClaim(claimName);
    }

    @SuppressWarnings("unchecked")
    private Collection<GrantedAuthority> extractResourceRoles(Jwt jwt) {
        log.debug("==> Extrayendo roles del token...");
        Map<String, Object> resourceAccess = jwt.getClaim("resource_access");

        if (resourceAccess == null) {
            log.warn("==> Claim 'resource_access' no encontrado en el token.");
            return List.of();
        }

        log.debug("==> Claim 'resource_access' encontrado: {}", resourceAccess);

        if (!resourceAccess.containsKey(resourceId)) {
            log.warn("==> 'resource_access' no contiene el resource-id esperado: {}", resourceId);
            return List.of();
        }

        Map<String, Object> resource = (Map<String, Object>) resourceAccess.get(resourceId);
        Collection<String> resourceRoles = (Collection<String>) resource.get("roles");

        if (resourceRoles == null) {
            log.warn("==> No se encontró la clave 'roles' para el resource-id: {}", resourceId);
            return List.of();
        }

        log.info("==> Roles extraídos para el cliente '{}': {}", resourceId, resourceRoles);

        return resourceRoles.stream()
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toSet());
    }
}
