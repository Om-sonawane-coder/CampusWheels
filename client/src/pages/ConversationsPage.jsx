import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';

function ConversationsPage() {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, token } = useContext(AuthContext);

  useEffect(() => {
    const fetchConversations = async () => {
      if (!token) return;
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/conversations`, {
          headers: { 'x-auth-token': token },
        });
        if (!response.ok) throw new Error('Failed to fetch conversations.');
        const data = await response.json();
        setConversations(data);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchConversations();
  }, [token]);

  if (loading) return <div className="text-center mt-10"><h2>Loading Chats...</h2></div>;

  return (
    <div className="container mx-auto p-4 max-w-lg">
      <h1 className="text-3xl font-bold text-center text-[var(--color-secondary)] mb-6">Your Conversations</h1>
      <div className="bg-white p-4 rounded-2xl shadow-xl">
        {conversations.length === 0 ? (
          <p className="text-center text-slate-500 py-8">You have no active conversations.</p>
        ) : (
          <ul className="divide-y divide-slate-200">
            {conversations.map(convo => {
              // Find the other participant in the conversation
              const otherParticipant = convo.participants.find(p => p._id !== user.id);
              if (!otherParticipant) return null;

              const lastMessage = convo.messages[0];

              return (
                <li key={convo._id}>
                  <Link to={`/chat/${otherParticipant._id}`} className="flex items-center space-x-4 p-3 hover:bg-slate-50 transition-colors">
                    <div className="relative flex-shrink-0 w-12 h-12 bg-[var(--color-accent)] rounded-full flex items-center justify-center">
                      <span className="text-xl font-bold text-white">{otherParticipant.name.charAt(0).toUpperCase()}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-md font-semibold text-slate-800 truncate">{otherParticipant.name}</p>
                      {lastMessage && (
                        <p className={`text-sm truncate ${convo.unreadCount > 0 ? 'text-slate-800 font-semibold' : 'text-slate-500'}`}>
                          {lastMessage.senderId === user.id ? 'You: ' : ''}{lastMessage.message}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col items-end space-y-1 self-start">
                      {lastMessage && (
                         <div className="text-xs text-slate-400">
                           {new Date(lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                         </div>
                      )}
                      {/* ===== NAYA UNREAD BADGE ===== */}
                      {convo.unreadCount > 0 && (
                        <div className="w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center mt-1">
                          {convo.unreadCount}
                        </div>
                      )}
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

export default ConversationsPage;