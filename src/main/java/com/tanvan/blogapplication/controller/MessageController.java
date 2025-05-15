package com.tanvan.blogapplication.controller;

import com.tanvan.blogapplication.dto.MessageRequest;
import com.tanvan.blogapplication.entity.User;
import com.tanvan.blogapplication.service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/api/messages")
@RequiredArgsConstructor
public class MessageController {
    private final MessageService messageService;

    @PostMapping("/send")
    public MessageRequest sendMessage(@RequestBody MessageRequest request) {
        return messageService.sendMessage(request);
    }

    @GetMapping("/conversation")
    public List<MessageRequest> getConversation(@RequestParam Long user1,
                                            @RequestParam Long user2) {
        return messageService.getConversation(user1, user2);
    }

    @GetMapping("/partners/{userId}")
    public List<User> getChatPartners(@PathVariable Long userId) {
        return messageService.getChatPartners(userId);
    }
}
