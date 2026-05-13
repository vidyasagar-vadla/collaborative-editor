package com.example.demo.websocket;

import org.springframework.web.socket.*;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.util.*;

public class CodeEditorHandler extends TextWebSocketHandler {

    // roomId -> users
    private static final Map<String,
            List<WebSocketSession>> rooms = new HashMap<>();

    @Override
    public void afterConnectionEstablished(
            WebSocketSession session
    ) {

        System.out.println("Client Connected");
    }

    @Override
    protected void handleTextMessage(
            WebSocketSession session,
            TextMessage message
    ) throws Exception {

        String payload = message.getPayload();

        // format:
        // roomId:::code

        String[] parts = payload.split(":::", 2);

        String roomId = parts[0];
        String code = parts[1];

        rooms.putIfAbsent(
                roomId,
                new ArrayList<>()
        );

        if (!rooms.get(roomId).contains(session)) {

            rooms.get(roomId).add(session);
        }

        for (WebSocketSession s : rooms.get(roomId)) {

            if (s.isOpen()) {

                s.sendMessage(
                        new TextMessage(code)
                );
            }
        }
    }

    @Override
    public void afterConnectionClosed(
            WebSocketSession session,
            CloseStatus status
    ) {

        for (List<WebSocketSession> sessions :
                rooms.values()) {

            sessions.remove(session);
        }

        System.out.println("Disconnected");
    }
}