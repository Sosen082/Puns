package com.sosen.puns.web;

import com.sosen.puns.model.ChatMessage;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Controller
@RequestMapping("/app")
@CrossOrigin
public class PunsController {

    private DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    @MessageMapping("/message")
    @SendTo("/app/chatMessage")
    public ChatMessage message(ChatMessage chatMessage) {
        chatMessage.setDate(LocalDateTime.now().format(formatter));
        return chatMessage;
    }
}
