package com.tanvan.blogapplication.mapper;

import com.tanvan.blogapplication.dto.MessageRequest;
import com.tanvan.blogapplication.entity.Message;
import com.tanvan.blogapplication.entity.User;

import java.time.LocalDateTime;

public class MessageMapper {

    public static Message toEntity(MessageRequest dto, User sender, User receiver) {
        Message message = new Message();
        message.setSender(sender);
        message.setReceiver(receiver);
        message.setContent(dto.getContent());
        message.setSentAt(LocalDateTime.now()); // Gán tại thời điểm gửi
        return message;
    }

    public static MessageRequest toDTO(Message message) {
        MessageRequest dto = new MessageRequest();
        dto.setSenderId(message.getSender().getId());
        dto.setReceiverId(message.getReceiver().getId());
        dto.setContent(message.getContent());
        dto.setSentAt(message.getSentAt());
        return dto;
    }
}
