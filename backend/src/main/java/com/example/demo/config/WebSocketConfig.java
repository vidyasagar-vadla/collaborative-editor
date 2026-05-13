package com.example.demo.config;

import com.example.demo.websocket.CodeEditorHandler;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.*;

@Configuration
@EnableWebSocket
public class WebSocketConfig
        implements WebSocketConfigurer {

    @Override
    public void registerWebSocketHandlers(
            WebSocketHandlerRegistry registry
    ) {

        registry.addHandler(
                new CodeEditorHandler(),
                "/ws"
        ).setAllowedOrigins("*");
    }
}