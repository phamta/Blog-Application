package com.tanvan.blogapplication.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.security.Key;
import java.util.Date;

@Component
@CrossOrigin
public class JwtUtil {

    private final Key key = Keys.hmacShaKeyFor("tanvan_secret_keytanvan_secret_key".getBytes());
    // cần >=256 bit (32 ký tự) cho HS256

    public String generateToken(Long userId) {
        return Jwts.builder()
                .claim("userId", userId)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 30)) // 30 phút
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public Claims extractClaims(String token) throws ExpiredJwtException {
        return Jwts.parser()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}
