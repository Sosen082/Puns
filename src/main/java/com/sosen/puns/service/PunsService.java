package com.sosen.puns.service;

import com.sosen.puns.mapper.PunsMapper;
import com.sosen.puns.model.Message;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PunsService {

    private static final Logger log = LoggerFactory.getLogger(PunsService.class);

    @Autowired
    private PunsMapper punsMapper;

    public void saveMessage(Message message) {
        this.punsMapper.insertMessage(message);
        log.info("Save message {}", message);
    }
}
