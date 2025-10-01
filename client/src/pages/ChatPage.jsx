import React, { useState, useEffect, useContext, useRef } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';

let socket;

function ChatPage() {
  const { receiverId } = useParams();
  const { user, token, fetchUnreadCount } = useContext(AuthContext);
  
  const [currentMessage, setCurrentMessage] = useState('');
  const [messageList, setMessageList] = useState([]);
  const messageContainerRef = useRef(null);

  useEffect(() => {
    if (user && token) {
      const markAsRead = async () => {
        try {
          console.log("2. [ChatPage] Marking messages as read for sender:", receiverId); // DEBUG LOG
          const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/messages/read/${receiverId}`, {
            method: 'PUT',
            headers: { 'x-auth-token': token }
          });
          if(!res.ok) throw new Error("Mark as read API failed");
          console.log("3. [ChatPage] Mark as read successful. Now refreshing count."); // DEBUG LOG
          fetchUnreadCount();
        } catch (error) {
          console.error("Failed to mark messages as read", error);
        }
      };
      markAsRead();
      
      socket = io(import.meta.env.VITE_API_BASE_URL, {
        query: { userId: user.id },
      });

      socket.emit('get_chat_history', { senderId: user.id, receiverId });
      socket.on('chat_history', (history) => {
        setMessageList(history);
      });

      const messageListener = (newMessage) => {
        if (
          (newMessage.senderId === user.id && newMessage.receiverId === receiverId) || 
          (newMessage.senderId === receiverId && newMessage.receiverId === user.id)
        ) {
          setMessageList((list) => [...list, newMessage]);
        }
      };
      socket.on('receive_message', messageListener);

      return () => {
        socket.off('chat_history');
        socket.off('receive_message', messageListener);
        socket.disconnect();
      };
    }
  }, [user, token, receiverId, fetchUnreadCount]);
  
  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  }, [messageList]);

  const sendMessage = async () => {
    if (currentMessage.trim() !== "" && user) {
      const messageData = {
        senderId: user.id,
        receiverId: receiverId,
        message: currentMessage,
      };
      await socket.emit('send_message', messageData);
      setCurrentMessage("");
    }
  };

  return (
    <div className="container mx-auto p-4 flex flex-col h-[calc(100vh-120px)]">
      <h1 className="text-3xl font-bold text-center text-[var(--color-secondary)] mb-4">Chat</h1>
      
      <div ref={messageContainerRef} className="flex-grow bg-white p-4 rounded-lg shadow-inner overflow-y-auto mb-4">
        {messageList.map((msg) => (
          <div key={msg._id || new Date(msg.createdAt).getTime()} className={`flex mb-4 ${msg.senderId === user.id ? 'justify-end' : 'justify-start'}`}>
            <div className={`p-3 rounded-lg max-w-xs ${msg.senderId === user.id ? 'bg-[var(--color-primary)] text-white' : 'bg-gray-200 text-black'}`}>
              <p>{msg.message}</p>
              <p className={`text-xs mt-1 text-right ${msg.senderId === user.id ? 'text-gray-300' : 'text-gray-500'}`}>
                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex space-x-2">
        <input 
          type="text" value={currentMessage} placeholder="Type your message..."
          className="flex-grow p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
          onChange={(e) => setCurrentMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button onClick={sendMessage} className="bg-[var(--color-accent)] text-white font-bold py-3 px-6 rounded-lg hover:opacity-90">Send</button>
      </div>
    </div>
  );
}

export default ChatPage;