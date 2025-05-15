package com.tanvan.blogapplication.repository;

import com.tanvan.blogapplication.entity.Message;
import com.tanvan.blogapplication.entity.User;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findBySenderIdAndReceiverIdOrReceiverIdAndSenderIdOrderBySentAtAsc(
            Long senderId1, Long receiverId1, Long senderId2, Long receiverId2
    );

    @Query("SELECT DISTINCT m.receiver FROM Message m WHERE m.sender.id = :userId")
    List<User> findReceiversBySenderId(Long userId);

    @Query("SELECT DISTINCT m.sender FROM Message m WHERE m.receiver.id = :userId")
    List<User> findSendersByReceiverId(Long userId);
}
