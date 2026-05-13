import { useEffect, useRef, useState } from "react";
import Editor from "@monaco-editor/react";

function App() {

  const [code, setCode] = useState("// Start Typing...");
  const [connected, setConnected] = useState(false);

  const [roomId, setRoomId] = useState("");

  const [joined, setJoined] = useState(false);

  const socketRef = useRef(null);

  useEffect(() => {

    const socket = new WebSocket(
      "ws://192.168.1.6:8080/ws"
    );

    socket.onopen = () => {

      setConnected(true);
    };

    socket.onmessage = (event) => {

      setCode(event.data);
    };

    socket.onclose = () => {

      setConnected(false);
    };

    socketRef.current = socket;

    return () => {

      socket.close();
    };

  }, []);

  const handleChange = (value) => {

    setCode(value);

    if (
      socketRef.current &&
      socketRef.current.readyState === WebSocket.OPEN &&
      joined
    ) {

      socketRef.current.send(
        roomId + ":::" + value
      );
    }
  };

  // JOIN SCREEN

  if (!joined) {

    return (

      <div
        style={{
          height: "100vh",
          background: "#0f172a",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontFamily: "sans-serif"
        }}
      >

        <div
          style={{
            width: "400px",
            background: "#111827",
            padding: "40px",
            borderRadius: "20px",
            color: "white",
            boxShadow: "0 0 30px rgba(0,0,0,0.4)"
          }}
        >

          <h1>
            Join Room
          </h1>

          <input
            placeholder="Enter Room ID"
            value={roomId}
            onChange={(e) =>
              setRoomId(e.target.value)
            }
            style={{
              width: "100%",
              padding: "15px",
              marginTop: "20px",
              borderRadius: "10px",
              border: "none",
              outline: "none",
              fontSize: "16px"
            }}
          />

          <button
            onClick={() => {

              if (roomId.trim() !== "") {

                setJoined(true);
              }
            }}
            style={{
              width: "100%",
              marginTop: "20px",
              padding: "15px",
              background: "#2563eb",
              color: "white",
              border: "none",
              borderRadius: "10px",
              fontSize: "16px",
              cursor: "pointer"
            }}
          >
            Join Room
          </button>

        </div>

      </div>
    );
  }

  return (

    <div
      style={{
        height: "100vh",
        background: "#0f172a",
        display: "flex",
        flexDirection: "column"
      }}
    >

      {/* Navbar */}

      <div
        style={{
          height: "70px",
          background: "#111827",
          color: "white",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 30px",
          borderBottom: "1px solid #1e293b"
        }}
      >

        <div>

          <h2 style={{ margin: 0 }}>
            Collaborative Editor
          </h2>

          <p
            style={{
              margin: 0,
              color: "#94a3b8",
              fontSize: "13px"
            }}
          >
            Room: {roomId}
          </p>

        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px"
          }}
        >

          <div
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              background:
                connected
                  ? "#22c55e"
                  : "#ef4444"
            }}
          />

          <span>
            {connected
              ? "Connected"
              : "Disconnected"}
          </span>

        </div>

      </div>

      {/* Editor */}

      <div
        style={{
          flex: 1,
          padding: "20px"
        }}
      >

        <div
          style={{
            height: "100%",
            borderRadius: "16px",
            overflow: "hidden"
          }}
        >

          <Editor
            height="100%"
            defaultLanguage="javascript"
            theme="vs-dark"
            value={code}
            onChange={handleChange}
          />

        </div>

      </div>

    </div>
  );
}

export default App;