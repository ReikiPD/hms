import React, { useState, useEffect } from "react";
import axios from "axios";

const Chat = ({ userId, doctorId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  // Fetch messages when the component loads
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.post("/api/getMessages", {
          userId,
          doctorId,
        });

        if (response.data.success) {
          setMessages(response.data.messages);
        } else {
          console.error(response.data.message);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, [userId, doctorId]);

  // Handle sending a new message
  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const response = await axios.post("/api/sendMessage", {
        senderId: userId,
        receiverId: doctorId,
        message: newMessage,
      });

      if (response.data.success) {
        setMessages((prevMessages) => [...prevMessages, response.data.chat]);
        setNewMessage("");
      } else {
        console.error(response.data.message);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="flex flex-col h-screen w-96 border border-gray-300 rounded overflow-hidden">
      <div className="bg-primary text-white py-2 px-4 text-center font-bold">
        Chat with Doctor
      </div>

      <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-4 p-3 rounded max-w-2/3 ${
              msg.senderId === userId
                ? "bg-primary text-white self-end"
                : "bg-gray-200 text-black self-start"
            }`}
          >
            <p>{msg.message}</p>
            <span className="block text-xs text-gray-500 mt-1">
              {new Date(msg.timestamp).toLocaleString()}
            </span>
          </div>
        ))}
      </div>

      <div className="flex p-4 border-t border-gray-300">
        <input
          type="text"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 p-2 border border-gray-300 rounded mr-2"
        />
        <button
          onClick={handleSendMessage}
          className="px-4 py-2 bg-primary text-white rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;