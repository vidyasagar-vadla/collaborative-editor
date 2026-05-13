package com.example.demo.controller;


import com.example.demo.model.CodeMessage;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class EditorController {

    @MessageMapping("/code")
    @SendTo("/topic/code")
    public CodeMessage syncCode(CodeMessage message) {
        return message;
    }
}