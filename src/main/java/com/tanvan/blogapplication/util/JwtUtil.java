//package com.tanvan.blogapplication.util;
//
//import io.jsonwebtoken.*;
//import io.jsonwebtoken.security.Keys;
//import org.springframework.stereotype.Component;
//
//import java.security.Key;
//import java.util.Date;
//
//@Component
//public class JWTService {
//
//    private final Key key = Keys.hmacShaKeyFor("tanvan_secret_keytanvan_secret_key".getBytes());
//
//    private final long ACCESS_TOKEN_EXPIRATION = 1000 * 60 * 15; // 15 phút
//    private final long REFRESH_TOKEN_EXPIRATION = 1000L * 60 * 60 * 24 * 7; // 7 ngày
//
//    public String generateAccessToken(Long userId) {
//        return Jwts.builder()
//                .claim("userId", userId)
//                .setIssuedAt(new Date())
//                .setExpiration(new Date(System.currentTimeMillis() + ACCESS_TOKEN_EXPIRATION))
//                .signWith(key, SignatureAlgorithm.HS256)
//                .compact();
//    }
//
//    public String generateRefreshToken(Long userId) {
//        return Jwts.builder()
//                .claim("userId", userId)
//                .setIssuedAt(new Date())
//                .setExpiration(new Date(System.currentTimeMillis() + REFRESH_TOKEN_EXPIRATION))
//                .signWith(key, SignatureAlgorithm.HS256)
//                .compact();
//    }
//
//    public Claims extractClaims(String token) throws ExpiredJwtException, JwtException {
//        return Jwts.parser()
//                .setSigningKey(key)
//                .build()
//                .parseClaimsJws(token)
//                .getBody();
//    }
//
//    public boolean isTokenValid(String token) {
//        try {
//            extractClaims(token); // nếu lỗi thì throw
//            return true;
//        } catch (JwtException e) {
//            return false;
//        }
//    }
//
//    public Long extractUserId(String token) {
//        return extractClaims(token).get("userId", Long.class);
//    }
//}

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