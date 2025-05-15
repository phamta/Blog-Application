package com.tanvan.blogapplication.controller;

import com.tanvan.blogapplication.dto.MessageRequest;
import com.tanvan.blogapplication.service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.*;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.time.LocalDateTime;

@Controller
@RequiredArgsConstructor
public class WebSocketController {

    @Autowired
    private MessageService messageService;

    private final SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/chat.send")
    public void sendMessage(@Payload MessageRequest message) {
        message.setSentAt(LocalDateTime.now());

        // Lưu DB
         messageService.sendMessage(message);

        // Gửi đến người nhận theo topic cá nhân
        messagingTemplate.convertAndSend("/topic/messages/" + message.getReceiverId(), message);
    }
}

