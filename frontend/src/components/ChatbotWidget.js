
import React, { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import API_URL from "../services/api";
function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [voiceLanguage, setVoiceLanguage] = useState("en-IN");

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hello! 🌱 I'm AgriNova AI. Ask me anything about agriculture, soil health, crops or greenhouse management!"
    }
  ]);

  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth"
    });
  }, [messages, loading]);

  const sendMessage = async () => {
    const userMessage = message.trim();

    if (!userMessage || loading) return;

    setMessages((prev) => [
      ...prev,
      { role: "user", content: userMessage }
    ]);

    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/chatbot`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
      body: JSON.stringify({
  message: userMessage,
  history: messages
    .filter((msg) => msg.role === "user" || msg.role === "assistant")
    .slice(-10)
})
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to get response");
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.reply
        }
      ]);
    } catch (error) {
      console.error("Chatbot request failed:", error);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Sorry, I'm unable to connect right now. Please try again."
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const toggleVoiceInput = () => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. Please use Chrome or Edge.");
      return;
    }

    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = voiceLanguage;
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onstart = () => {
      setListening(true);
    };

    recognition.onresult = (event) => {
      let transcript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }

      setMessage(transcript);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  return (
    <>
      <style>{`
        .agri-chat-button {
          position: fixed;
          right: 28px;
          bottom: 28px;
          width: 62px;
          height: 62px;
          border-radius: 50%;
          border: none;
          background: #176b50;
          color: white;
          font-size: 27px;
          cursor: pointer;
          box-shadow: 0 6px 22px rgba(0,0,0,0.22);
          z-index: 9999;
          transition: transform 0.2s, background 0.2s;
        }

        .agri-chat-button:hover {
          transform: scale(1.08);
          background: #10583f;
        }

        .agri-chat-window {
          position: fixed;
          right: 28px;
          bottom: 105px;
          width: 370px;
          height: 510px;
          max-height: calc(100vh - 130px);
          background: #ffffff;
          border-radius: 18px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.20);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          z-index: 9998;
          border: 1px solid #e2e9e3;
          animation: agriChatOpen 0.25s ease;
        }

        @keyframes agriChatOpen {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .agri-chat-header {
          background: #176b50;
          color: white;
          padding: 17px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .agri-chat-header h3 {
          margin: 0;
          font-size: 16px;
        }

        .agri-chat-header p {
          margin: 4px 0 0;
          font-size: 11px;
          opacity: 0.85;
        }

        .agri-chat-close {
          border: none;
          background: transparent;
          color: white;
          font-size: 23px;
          cursor: pointer;
        }

        .agri-chat-messages {
          flex: 1;
          padding: 16px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 13px;
          background: #f7faf7;
        }

        .agri-chat-message {
          max-width: 85%;
          padding: 11px 13px;
          border-radius: 13px;
          font-size: 13px;
          line-height: 1.55;
          white-space: pre-wrap;
          overflow-wrap: anywhere;
        }

        .agri-chat-ai {
          align-self: flex-start;
          background: white;
          color: #263b30;
          border: 1px solid #e5ebe5;
          border-bottom-left-radius: 3px;
        }

        .agri-chat-markdown p {
  margin: 0 0 9px;
}

.agri-chat-markdown p:last-child {
  margin-bottom: 0;
}

.agri-chat-markdown strong {
  color: #176b50;
  font-weight: 700;
}

.agri-chat-markdown ul,
.agri-chat-markdown ol {
  padding-left: 20px;
  margin: 7px 0;
}

.agri-chat-markdown li {
  margin-bottom: 5px;
}

.agri-chat-markdown h1,
.agri-chat-markdown h2,
.agri-chat-markdown h3 {
  font-size: 14px;
  margin: 10px 0 6px;
  color: #176b50;
}

.agri-chat-markdown table {
  display: block;
  max-width: 100%;
  overflow-x: auto;
  border-collapse: collapse;
  font-size: 11px;
  margin: 10px 0;
}

.agri-chat-markdown th,
.agri-chat-markdown td {
  border: 1px solid #dce7dc;
  padding: 6px;
  text-align: left;
}

.agri-chat-markdown th {
  background: #edf4ee;
}
        .agri-chat-user {
          align-self: flex-end;
          background: #176b50;
          color: white;
          border-bottom-right-radius: 3px;
        }

        .agri-chat-loading {
          align-self: flex-start;
          color: #668074;
          font-size: 12px;
          padding: 8px;
        }

        .agri-chat-footer {
          padding: 12px;
          border-top: 1px solid #e8eee8;
          background: white;
        }

        .agri-chat-language {
          width: 100%;
          border: 1px solid #e0e8e0;
          border-radius: 8px;
          padding: 7px;
          margin-bottom: 9px;
          color: #315b47;
          background: #f8faf8;
          font-size: 11px;
        }

        .agri-chat-input-row {
          display: flex;
          gap: 7px;
          align-items: center;
        }

        .agri-chat-input {
          flex: 1;
          min-width: 0;
          border: 1px solid #dce5dc;
          border-radius: 10px;
          padding: 11px;
          font-size: 12px;
          outline: none;
        }

        .agri-chat-input:focus {
          border-color: #176b50;
        }

        .agri-chat-mic,
        .agri-chat-send {
          width: 38px;
          height: 38px;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          font-size: 16px;
        }

        .agri-chat-mic {
          background: #edf4ee;
          color: #176b50;
        }

        .agri-chat-mic.active {
          background: #fee2e2;
          color: #dc2626;
        }

        .agri-chat-send {
          background: #176b50;
          color: white;
        }

        .agri-chat-send:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        @media (max-width: 480px) {
          .agri-chat-window {
            width: calc(100vw - 24px);
            right: 12px;
            bottom: 90px;
            height: min(510px, calc(100vh - 110px));
          }

          .agri-chat-button {
            right: 17px;
            bottom: 17px;
          }
        }
      `}</style>

      {isOpen && (
        <div className="agri-chat-window">
          <div className="agri-chat-header">
  <div>
    <h3>🌱 AgriNova AI</h3>
    <p>Your Smart Agriculture Assistant</p>
  </div>

  <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
    <button
      className="agri-chat-close"
      title="Start a new chat"
      onClick={() => {
        setMessages([
          {
            role: "assistant",
            content: "Hello! 🌱 I'm AgriNova AI. How can I help you today?"
          }
        ]);
        setMessage("");
      }}
      style={{ fontSize: "17px" }}
    >
      ↻
    </button>

    <button
      className="agri-chat-close"
      onClick={() => setIsOpen(false)}
    >
      ×
    </button>
  </div>
</div>

          <div className="agri-chat-messages">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`agri-chat-message ${
                  msg.role === "user"
                    ? "agri-chat-user"
                    : "agri-chat-ai"
                }`}
              >
               {msg.role === "assistant" ? (
  <div className="agri-chat-markdown">
    <ReactMarkdown remarkPlugins={[remarkGfm]}>
      {msg.content}
    </ReactMarkdown>
  </div>
) : (
  msg.content
)}
              </div>
            ))}

            {loading && (
              <div className="agri-chat-loading">
                AgriNova AI is thinking... 🌿
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="agri-chat-footer">
            <select
              className="agri-chat-language"
              value={voiceLanguage}
              onChange={(e) => setVoiceLanguage(e.target.value)}
              disabled={listening}
            >
              <option value="en-IN">English</option>
              <option value="hi-IN">हिंदी</option>
              <option value="pa-IN">ਪੰਜਾਬੀ</option>
            </select>

            <div className="agri-chat-input-row">
              <input
                className="agri-chat-input"
                type="text"
                placeholder="Ask AgriNova anything..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") sendMessage();
                }}
              />

              <button
                className={`agri-chat-mic ${
                  listening ? "active" : ""
                }`}
                onClick={toggleVoiceInput}
                title="Voice input"
              >
                {listening ? "⏹" : "🎙"}
              </button>

              <button
                className="agri-chat-send"
                onClick={sendMessage}
                disabled={loading || !message.trim()}
                title="Send message"
              >
                ➤
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        className="agri-chat-button"
        onClick={() => setIsOpen(!isOpen)}
        title="Chat with AgriNova AI"
      >
        {isOpen ? "×" : "💬"}
      </button>
    </>
  );
}

export default ChatbotWidget;
