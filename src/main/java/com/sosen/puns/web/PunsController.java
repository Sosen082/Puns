package com.sosen.puns.web;

import com.sosen.puns.model.Message;
import com.sosen.puns.model.Stroke;
import com.sosen.puns.service.PunsService;
import org.springframework.beans.factory.annotation.Autowired;
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

    @Autowired
    private PunsService punsService;

    private DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    @MessageMapping("/message")
    @SendTo("/app/message")
    public Message message(Message message) {
        message.setDate(LocalDateTime.now().format(formatter));
        punsService.saveMessage(message);
        return message;
    }

    @MessageMapping("/stroke")
    @SendTo("/app/stroke")
    public Stroke stroke(Stroke stroke) {
        return stroke;
    }
}
