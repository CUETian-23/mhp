import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User } from 'lucide-react';

const AIAssistant = () => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! I\'m your AI mental health assistant. I\'m here to listen, provide support, and help you track your wellness journey. How are you feeling today?',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = { role: 'user', content: input };
    setMessages([...messages, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // Simulate AI response (in production, this would call the AI backend)
      setTimeout(() => {
        const aiResponse = generateAIResponse(input);
        setMessages((prev) => [...prev, { role: 'assistant', content: aiResponse }]);
        setLoading(false);
      }, 1000);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'I apologize, but I\'m having trouble responding right now. Please try again.' },
      ]);
      setLoading(false);
    }
  };

  const generateAIResponse = (userInput) => {
    const lowerInput = userInput.toLowerCase();
    
    if (lowerInput.includes('sad') || lowerInput.includes('depressed') || lowerInput.includes('down')) {
      return 'I\'m sorry you\'re feeling this way. It\'s important to acknowledge these feelings. Would you like to talk more about what\'s making you feel sad? Sometimes sharing can help lighten the burden.';
    }
    
    if (lowerInput.includes('anxious') || lowerInput.includes('worried') || lowerInput.includes('stress')) {
      return 'Anxiety can be really challenging. Have you tried any breathing exercises or grounding techniques? I can guide you through some if you\'d like. What\'s been on your mind?';
    }
    
    if (lowerInput.includes('happy') || lowerInput.includes('good') || lowerInput.includes('great')) {
      return 'That\'s wonderful to hear! It\'s great to celebrate positive moments. What\'s been contributing to your good mood today?';
    }
    
    if (lowerInput.includes('help') || lowerInput.includes('advice')) {
      return 'I\'m here to help. Whether you need someone to listen to, suggestions for coping strategies, or just want to chat, I\'m available. What would be most helpful for you right now?';
    }
    
    if (lowerInput.includes('suicide') || lowerInput.includes('kill') || lowerInput.includes('end it')) {
      return 'I\'m very concerned about what you\'re sharing. Please know that you\'re not alone and there are people who want to help. If you\'re in immediate danger, please call 911 or the National Suicide Prevention Lifeline at 988. You can also visit the Crisis Support page for more resources. Your life matters.';
    }
    
    return 'Thank you for sharing that with me. I\'m here to listen and support you. Can you tell me more about how you\'ve been feeling lately?';
  };

  return (
    <div className="ai-assistant">
      <div className="assistant-header">
        <Bot size={32} />
        <h2>AI Mental Health Assistant</h2>
        <p>Your supportive companion for mental wellness</p>
      </div>

      <div className="chat-container">
        <div className="messages-container">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`message ${message.role === 'user' ? 'user-message' : 'assistant-message'}`}
            >
              <div className="message-icon">
                {message.role === 'user' ? <User size={20} /> : <Bot size={20} />}
              </div>
              <div className="message-content">
                <p>{message.content}</p>
              </div>
            </div>
          ))}
          {loading && (
            <div className="message assistant-message">
              <div className="message-icon">
                <Bot size={20} />
              </div>
              <div className="message-content loading">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSendMessage} className="message-form">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            disabled={loading}
          />
          <button type="submit" disabled={loading || !input.trim()} className="btn-send">
            <Send size={20} />
          </button>
        </form>
      </div>

      <div className="assistant-disclaimer">
        <p>
          <strong>Note:</strong> This AI assistant provides general support and is not a substitute for 
          professional mental health care. For serious concerns, please consult a mental health professional 
          or use the crisis resources.
        </p>
      </div>
    </div>
  );
};

export default AIAssistant;
