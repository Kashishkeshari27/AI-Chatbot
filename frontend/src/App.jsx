import { useEffect, useState, useRef } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import Login from "./Login"
import Signup from "./Signup"
import "./App.css";

function App() {
  const [user,setUser]=useState(()=>{
    const savedUser=localStorage.getItem("user")
    return savedUser ? JSON.parse(savedUser):null;
  })
  const [showSignup,setShowSignup]=useState("")
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "Hello! 👋 I'm your AI assistant. How can I help you?"
    }
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [darkMode,setDarkMode]=useState(true)

  const toggleTheme =()=>{
    setDarkMode((prev)=>!prev)
  }

  const messagesEndRef = useRef(null);

  // Auto scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth"
    });
  }, [messages, isLoading]);


  // Fetch chat history
  const fetchChatHistory = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/chat/history`,{
          headers:{
            Authorization:`Bearer ${token}`
          }
        }
      );

      const history = response.data.chats;

      const formattedMessages = [];

      history.forEach((chat) => {
        formattedMessages.push({
          sender: "user",
          text: chat.userMessage
        });

        formattedMessages.push({
          sender: "ai",
          text: chat.aiResponse
        });
      });

      if (formattedMessages.length > 0) {
        setMessages(formattedMessages);
      }

    } catch (error) {
      console.error("History Error:", error);
    }
  };


  // Load history when application starts
  useEffect(() => {
    if(user){
    fetchChatHistory();
    }
  }, [user]);


  // Send message
  const sendMessage = async () => {
    if (!message.trim() || isLoading) return;
    const token=localStorage.getItem("token")
    const currentMessage = message.trim();

    const userMessage = {
      sender: "user",
      text: currentMessage
    };

    setMessages((prev) => [...prev, userMessage]);

    setMessage("");
    setIsLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/chat`,
        {
          message: currentMessage
        },
        {
          headers:{
            Authorization:`Bearer ${token}`
          }
        }
      );

      const aiMessage = {
        sender: "ai",
        text: response.data.reply
      };

      setMessages((prev) => [...prev, aiMessage]);

    } catch (error){
  console.error("Chat Error:", error);

  let errorText = "Something went wrong. Please try again.";

  if (error.response) {
    if (error.response.status === 429) {
      errorText = "AI service is temporarily busy. Please try again in a moment.";
    } else if (error.response.status === 500) {
      errorText = "The server encountered an error. Please try again.";
    } else if (error.response.data?.message) {
      errorText = error.response.data.message;
    }
  } else if (error.request) {
    errorText = "Unable to connect to the server.";
  }

  setMessages((prev) => [
    ...prev,
    {
      sender: "ai",
      text: errorText
    }
  ]);
} finally {
      setIsLoading(false);
    }
  };


  // Clear chat from UI only
  const clearChat = () => {
    setMessages([
      {
        sender: "ai",
        text: "Hello! 👋 I'm your AI assistant. How can I help you?"
      }
    ]);
  };
  if (!user) {
  if (showSignup) {
    return (
      <Signup
        onShowLogin={() => setShowSignup(false)}
        darkMode={darkMode}
        onToggleTheme={toggleTheme}

      />
    );
  }
  const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  setUser(null);

  setMessages([
    {
      sender: "ai",
      text: "Hello! 👋 I'm your AI assistant. How can I help you?"
    }
  ]);
};

  return (
    <Login
      onLogin={(loggedInUser) => {
        setUser(loggedInUser);
      }}
      onShowSignup={() => setShowSignup(true)}
      darkMode={darkMode}
      onToggleTheme={toggleTheme}
    />
  );
}


return (
  <div className={`app ${darkMode ? "dark-mode" : "light-mode"}`}>

    {/* Background ambient lights */}
    <div className="ambient ambient-one"></div>
    <div className="ambient ambient-two"></div>
    <div className="ambient ambient-three"></div>

    <div className="chat-container">

      {/* ================= HEADER ================= */}
      <div className="chat-header">

        <div className="brand-section">

          <div className="ai-logo">
            <span>✦</span>
          </div>

          <div className="brand-info">
            <h2>AI Assistant</h2>

            <div className="status">
              <span className="status-dot"></span>

              <span>
                {isLoading ? "Generating response..." : "Online"}
              </span>
            </div>
          </div>

        </div>


        {/* Header actions */}
        <div className="header-actions">

          {/* Theme button */}
          <button
            className="icon-button"
            onClick={toggleTheme}
            title="Change theme"
          >
            {darkMode ? "☀️" : "🌙"}
          </button>


          {/* Clear button */}
          <button
            className="clear-button"
            onClick={clearChat}
          >
            <span>⌫</span>
            Clear
          </button>


          {/* Logout */}
          <button
            className="logout-button"
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("user");

              setUser(null);

              setMessages([
                {
                  sender: "ai",
                  text: "Hello! I'm your AI assistant. How can I help you?"
                }
              ]);
            }}
          >
            <span>↪</span>
            Logout
          </button>

        </div>

      </div>


      {/* ================= CHAT BODY ================= */}
      <div className="chat-body">

        {messages.map((msg, index) => (

          <div
            key={index}
            className={`message-row ${msg.sender}`}
          >

            {/* AI Avatar */}
            {msg.sender === "ai" && (
              <div className="message-avatar ai-avatar">
                ✦
              </div>
            )}


            <div className={`message ${msg.sender}`}>

              <ReactMarkdown>
                {msg.text}
              </ReactMarkdown>

            </div>


            {/* User Avatar */}
            {msg.sender === "user" && (
              <div className="message-avatar user-avatar">
                👤
              </div>
            )}

          </div>

        ))}


        {/* Loading animation */}
        {isLoading && (

          <div className="message-row ai">

            <div className="message-avatar ai-avatar">
              ✦
            </div>

            <div className="message ai typing">

              <span></span>
              <span></span>
              <span></span>

            </div>

          </div>

        )}


        {/* Auto scroll */}
        <div ref={messagesEndRef}></div>

      </div>


      {/* ================= INPUT ================= */}
      <div className="chat-input-wrapper">

        <div className="input-hint">
          <span>✦</span>
          Ask anything about technology, coding or development
        </div>

        <div className="chat-input">

          <input
            type="text"
            placeholder="Ask something..."
            value={message}
            disabled={isLoading}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {

              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }

            }}
          />

          <button
            className="send-button"
            onClick={sendMessage}
            disabled={isLoading || !message.trim()}
          >
            {isLoading ? (
              <span className="send-loading">...</span>
            ) : (
              <>
                Send
                <span>➜</span>
              </>
            )}
          </button>

        </div>

      </div>

    </div>

  </div>
);

}
export default App;
