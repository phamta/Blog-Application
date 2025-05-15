package com.tanvan.blogapplication.service;


import com.tanvan.blogapplication.dto.MessageRequest;
import com.tanvan.blogapplication.entity.Message;
import com.tanvan.blogapplication.entity.User;
import com.tanvan.blogapplication.mapper.MessageMapper;
import com.tanvan.blogapplication.repository.MessageRepository;
import com.tanvan.blogapplication.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MessageService {
    private final MessageRepository messageRepository;
    private final UserRepository userRepository;

    public MessageRequest sendMessage(MessageRequest request) {
        User sender = userRepository.findById(request.getSenderId())
                .orElseThrow(() -> new EntityNotFoundException("Sender not found with id: " + request.getSenderId()));
        User receiver = userRepository.findById(request.getReceiverId())
                .orElseThrow(() -> new EntityNotFoundException("Receiver not found with id: " + request.getReceiverId()));

        Message message = MessageMapper.toEntity(request, sender, receiver);

        Message saved = messageRepository.save(message);
        return MessageMapper.toDTO(saved);
    }

    public List<MessageRequest> getConversation(Long user1, Long user2) {
        List<Message> messages = messageRepository
                .findBySenderIdAndReceiverIdOrReceiverIdAndSenderIdOrderBySentAtAsc(user1, user2, user1, user2);
        return messages.stream()
                .map(MessageMapper::toDTO)
                .collect(Collectors.toList());
    }

    public List<User> getChatPartners(Long userId) {
        List<User> sentTo = messageRepository.findReceiversBySenderId(userId);
        List<User> receivedFrom = messageRepository.findSendersByReceiverId(userId);

        // Gộp và loại trùng
        Set<User> allPartners = new HashSet<>();
        allPartners.addAll(sentTo);
        allPartners.addAll(receivedFrom);

        return new ArrayList<>(allPartners);
    }
}
