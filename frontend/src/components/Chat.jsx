import React, { useEffect, useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Chat = ({ doctorId }) => {
    const { token, userData } = useContext(AppContext);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');

    const fetchMessages = async () => {
        try {
            const { data } = await axios.post('/api/user/get-messages', { userId: userData._id, doctorId }, { headers: { token } });
            if (data.success) {
                setMessages(data.messages);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    const sendMessage = async () => {
        if (!message) return;

        try {
            const { data } = await axios.post('/api/user/send-message', { senderId: userData._id, receiverId: doctorId, message }, { headers: { token } });
            if (data.success) {
                setMessages((prev) => [...prev, data.chat]);
                setMessage('');
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, [doctorId]);

    return (
        <div style={styles.chatContainer}>
            <div style={styles.messages}>
                {messages.map((msg, index) => (
                    <div key={index} style={{ ...styles.message, ...(msg.senderId === userData._id ? styles.sent : styles.received) }}>
                        <p>{msg.message}</p>
                    </div>
                ))}
            </div>
            <div style={styles.chatInput}>
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                    style={styles.input}
                />
                <button onClick={sendMessage} style={styles.button}>Send</button>
            </div>
        </div>
    );
};

const styles = {
    chatContainer: {
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid #ccc',
        padding: '10px',
        maxHeight: '400px',
        overflowY: 'auto',
        marginTop: '20px',
    },
    messages: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
    },
    message: {
        padding: '5px',
        margin: '5px 0',
        borderRadius: '5px',
    },
    sent: {
        alignSelf: 'flex-end',
        backgroundColor: '#5F6FFF',
        color: 'white',
    },
    received: {
        alignSelf: 'flex-start',
        backgroundColor: '#f1f1f1',
    },
    chatInput: {
        display: 'flex',
        gap: '10px',
    },
    input: {
        flex: 1,
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '5px',
    },
    button: {
        padding: '10px 20px',
        backgroundColor: '#5F6FFF',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
};

export default Chat;