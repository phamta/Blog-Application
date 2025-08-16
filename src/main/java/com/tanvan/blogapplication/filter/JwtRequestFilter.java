//package com.tanvan.blogapplication.filter;
//
////✅ Công dụng:
////Đây là bộ lọc (Filter) chạy trước khi API controller xử lý request. Nó dùng để:
////Xác minh access token
////Gắn thông tin userId vào request nếu token hợp lệ
//
//import com.tanvan.blogapplication.util.JWTService;
//import io.jsonwebtoken.Claims;
//import io.jsonwebtoken.ExpiredJwtException;
//import jakarta.servlet.*;
//import jakarta.servlet.http.HttpServletRequest;
//import jakarta.servlet.http.HttpServletResponse;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Component;
//
//import java.io.IOException;
//
//@Component
//public class JwtRequestFilter implements Filter {
//
//    @Autowired
//    private JWTService jwtUtil;
//
//    @Override
//    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain chain)
//            throws IOException, ServletException {
//
//        HttpServletRequest request = (HttpServletRequest) servletRequest;
//        HttpServletResponse response = (HttpServletResponse) servletResponse;
//
//        setCorsHeaders(response); // ✅ Đảm bảo luôn có header
//
//        // Xử lý preflight request (OPTIONS)
//        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
//            response.setStatus(HttpServletResponse.SC_OK);
//            return;
//        }
//
//        final String authHeader = request.getHeader("Authorization");
//
//        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
//            setCorsHeaders(response); // 🔁 Gọi lại để chắc chắn header có mặt
//            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
//            response.getWriter().write("Thiếu hoặc sai định dạng token");
//            return;
//        }
//
//        try {
//            String token = authHeader.substring(7);
//            Claims claims = jwtUtil.extractClaims(token);
//            request.setAttribute("userId", claims.get("userId"));
//
//            chain.doFilter(request, response);
//        } catch (ExpiredJwtException e) {
//            setCorsHeaders(response); // 🔁 Bổ sung ở lỗi
//            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
//            response.getWriter().write("Token đã hết hạn");
//        } catch (Exception e) {
//            setCorsHeaders(response); // 🔁 Bổ sung ở lỗi
//            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
//            response.getWriter().write("Token không hợp lệ: " + e.getMessage());
//        }
//    }
//
//
//
//    private void setCorsHeaders(HttpServletResponse response) {
//        response.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
//        response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
//        response.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type");
//        response.setHeader("Access-Control-Allow-Credentials", "true");
//    }
//
//}

package com.tanvan.blogapplication.filter;

import com.tanvan.blogapplication.util.JwtUtil;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class JwtRequestFilter implements Filter {

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest request = (HttpServletRequest) servletRequest;
        HttpServletResponse response = (HttpServletResponse) servletResponse;

        setCorsHeaders(response); // ✅ Đảm bảo luôn có header

        // Xử lý preflight request (OPTIONS)
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            response.setStatus(HttpServletResponse.SC_OK);
            return;
        }

        final String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            setCorsHeaders(response); // 🔁 Gọi lại để chắc chắn header có mặt
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Thiếu hoặc sai định dạng token");
            return;
        }

        try {
            String token = authHeader.substring(7);
            Claims claims = jwtUtil.extractClaims(token);
            request.setAttribute("userId", claims.get("userId"));

            chain.doFilter(request, response);
        } catch (ExpiredJwtException e) {
            setCorsHeaders(response); // 🔁 Bổ sung ở lỗi
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Token đã hết hạn");
        } catch (Exception e) {
            setCorsHeaders(response); // 🔁 Bổ sung ở lỗi
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Token không hợp lệ: " + e.getMessage());
        }
    }



    private void setCorsHeaders(HttpServletResponse response) {
        response.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type");
        response.setHeader("Access-Control-Allow-Credentials", "true");
    }

}