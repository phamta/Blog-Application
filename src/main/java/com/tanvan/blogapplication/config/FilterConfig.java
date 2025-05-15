package com.tanvan.blogapplication.config;

import com.tanvan.blogapplication.filter.JwtRequestFilter;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FilterConfig {

    @Bean
    public FilterRegistrationBean<JwtRequestFilter> jwtFilter(JwtRequestFilter filter) {
        FilterRegistrationBean<JwtRequestFilter> registrationBean = new FilterRegistrationBean<>();
        registrationBean.setFilter(filter);

        // Đăng ký các URL cần bảo vệ
        registrationBean.addUrlPatterns(
                "/api/user/*",
                "/api/users",
                "/api/all",
                "/api/update/*",
                "/api/delete/*",
                "/api/posts/upload",
                "/api/posts/user/*",
                "/api/likes/*",
                "/api/comments/add",
                "/api/messages/*"
        );

        return registrationBean;
    }
}
