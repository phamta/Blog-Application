package com.tanvan.blogapplication.repository;

import com.tanvan.blogapplication.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
}
