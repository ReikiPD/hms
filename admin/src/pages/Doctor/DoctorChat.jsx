import React, { useState, useEffect } from "react";
import axios from "axios";

const DoctorChat = ({ doctorId }) => {
  const [patients, setPatients] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  // Fetch patient list when the component loads
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.post("/api/getPatients", {
          doctorId,
        });

        if (response.data.success) {
          setPatients(response.data.patients);
        } else {
          console.error(response.data.message);
        }
      } catch (error) {
        console.error("Error fetching patients:", error);
      }
    };

    fetchPatients();
  }, [doctorId]);

  // Fetch messages for the selected patient
  useEffect(() => {
    if (!selectedPatientId) return;

    const fetchMessages = async () => {
      try {
        const response = await axios.post("/api/getMessages", {
          userId: selectedPatientId,
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
  }, [doctorId, selectedPatientId]);

  // Handle sending a new message
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedPatientId) return;

    try {
      const response = await axios.post("/api/sendMessage", {
        senderId: doctorId,
        receiverId: selectedPatientId,
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
    <div className="flex h-screen">
      {/* Patient List */}
      <div className="w-1/3 border-r border-gray-300 overflow-y-auto">
        <div className="bg-primary text-white py-2 px-4 text-center font-bold">
          Patients
        </div>
        <ul>
          {patients.map((patient) => (
            <li
              key={patient.id}
              className={`p-4 cursor-pointer border-b border-gray-300 ${
                selectedPatientId === patient.id ? "bg-gray-200" : ""
              }`}
              onClick={() => setSelectedPatientId(patient.id)}
            >
              {patient.name}
            </li>
          ))}
        </ul>
      </div>

      {/* Chat Section */}
      <div className="flex-1 flex flex-col h-screen">
        <div className="bg-primary text-white py-2 px-4 text-center font-bold">
          {selectedPatientId ? "Chat with Patient" : "Select a Patient"}
        </div>

        {selectedPatientId ? (
          <>
            <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`mb-4 p-3 rounded max-w-2/3 ${
                    msg.senderId === doctorId
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
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a patient to start chatting
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorChat;