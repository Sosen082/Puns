package com.sosen.puns.web;

import com.sosen.puns.model.Message;
import com.sosen.puns.model.Stroke;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Collection;

@Controller
@RequestMapping("/app")
@CrossOrigin
public class PunsController {

    private DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    @MessageMapping("/message")
    @SendTo("/app/message")
    public Message message(Message message) {
        message.setDate(LocalDateTime.now().format(formatter));
        return message;
    }

   @MessageMapping("/stroke")
    @SendTo("/app/stroke")
    public Stroke stroke(Stroke stroke) {
        return stroke;
    }
}
