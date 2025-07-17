// // frontend/src/components/ChatBox.tsx
// import { useState } from 'react';
// import { Send, MessageCircle, Loader2 } from 'lucide-react';

// type Message = {
//   type: 'user' | 'bot';
//   text: string;
//   timestamp: Date;
// };

// export default function ChatBox() {
//   const [query, setQuery] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [messages, setMessages] = useState<Message[]>([
//     {
//       type: 'bot',
//       text: 'Hello! I\'m your PDF assistant. Upload a PDF and start asking questions about it.',
//       timestamp: new Date()
//     }
//   ]);

//   const sendMessage = async () => {
//     if (!query.trim()) return;

//     const userMessage: Message = { 
//       type: 'user', 
//       text: query, 
//       timestamp: new Date() 
//     };
//     setMessages((prev) => [...prev, userMessage]);
//     setLoading(true);

//     const formData = new FormData();
//     formData.append('message', query);

//     try {
//       const res = await fetch('http://localhost:8000/chat/', {
//         method: 'POST',
//         body: formData,
//       });

//       const data = await res.json();
//       const botMessage: Message = { 
//         type: 'bot', 
//         text: data.response, 
//         timestamp: new Date() 
//       };
//       setMessages((prev) => [...prev, botMessage]);
//     } catch (err) {
//       const errorMessage: Message = {
//         type: 'bot',
//         text: 'Failed to reach backend. Please try again.',
//         timestamp: new Date()
//       };
//       setMessages((prev) => [...prev, errorMessage]);
//     } finally {
//       setQuery('');
//       setLoading(false);
//     }
//   };

//   const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       sendMessage();
//     }
//   };

//   return (
//     <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/30 flex flex-col h-full">
//       {/* Header */}
//       <div className="p-6 border-b border-white/20">
//         <div className="flex items-center gap-3">
//           <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center">
//             <MessageCircle className="w-5 h-5 text-white" />
//           </div>
//           <div>
//             <h3 className="text-lg font-semibold text-slate-800">Chat Assistant</h3>
//             <p className="text-sm text-slate-500">Ask questions about your PDF</p>
//           </div>
//         </div>
//       </div>

//       {/* Messages */}
//       <div className="flex-1 p-6 overflow-y-auto space-y-4">
//         {messages.map((msg, idx) => (
//           <div
//             key={idx}
//             className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
//           >
//             <div
//               className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
//                 msg.type === 'user'
//                   ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
//                   : 'bg-slate-100 text-slate-800'
//               } shadow-md`}
//             >
//               <p className="text-sm leading-relaxed">{msg.text}</p>
//               <p className={`text-xs mt-1 ${
//                 msg.type === 'user' ? 'text-white/70' : 'text-slate-500'
//               }`}>
//                 {msg.timestamp.toLocaleTimeString([], { 
//                   hour: '2-digit', 
//                   minute: '2-digit' 
//                 })}
//               </p>
//             </div>
//           </div>
//         ))}
        
//         {loading && (
//           <div className="flex justify-start">
//             <div className="bg-slate-100 px-4 py-3 rounded-2xl shadow-md">
//               <div className="flex items-center gap-2">
//                 <Loader2 className="w-4 h-4 animate-spin text-slate-500" />
//                 <span className="text-sm text-slate-500">Thinking...</span>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Input */}
//       <div className="p-6 border-t border-white/20">
//         <div className="flex gap-3">
//           <input
//             type="text"
//             value={query}
//             onChange={(e) => setQuery(e.target.value)}
//             onKeyDown={handleKeyDown}
//             placeholder="Ask something about the PDF..."
//             className="flex-1 px-4 py-3 bg-white/80 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-slate-400"
//             disabled={loading}
//           />
//           <button
//             onClick={sendMessage}
//             disabled={loading || !query.trim()}
//             className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-slate-300 disabled:to-slate-400 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
//           >
//             <Send className="w-4 h-4" />
//             Send
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// frontend/src/components/ChatBox.tsx
import { useState, useEffect, useRef } from 'react';
import { Send, MessageCircle, Loader2 } from 'lucide-react';

type Message = {
  type: 'user' | 'bot';
  text: string;
  timestamp: Date;
};

export default function ChatBox() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      type: 'bot',
      text: 'Hello! I\'m your PDF assistant. Upload a PDF and start asking questions about it.',
      timestamp: new Date()
    }
  ]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!query.trim()) return;

    const userMessage: Message = { 
      type: 'user', 
      text: query, 
      timestamp: new Date() 
    };
    setMessages(prev => [...prev, userMessage]);
    setLoading(true);

    const formData = new FormData();
    formData.append('message', query);

    try {
      const res = await fetch('http://localhost:8000/chat/', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      const botMessage: Message = { 
        type: 'bot', 
        text: data.response, 
        timestamp: new Date() 
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      const errorMessage: Message = {
        type: 'bot',
        text: 'Failed to reach backend. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setQuery('');
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/30 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-white/20 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center">
            <MessageCircle className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-800">Chat Assistant</h3>
            <p className="text-sm text-slate-500">Ask questions about your PDF</p>
          </div>
        </div>
      </div>

      {/* Messages Container with Custom Scrollbar */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <div
          className="h-full p-4 space-y-4 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100 hover:scrollbar-thumb-slate-400"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: '#cbd5e1 #f1f5f9'
          }}
        >
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] px-4 py-3 rounded-2xl ${
                  msg.type === 'user'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                    : 'bg-slate-100 text-slate-800'
                } shadow-md`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                <p className={`text-xs mt-1 ${
                  msg.type === 'user' ? 'text-white/70' : 'text-slate-500'
                }`}>
                  {msg.timestamp.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-slate-100 px-4 py-3 rounded-2xl shadow-md">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-slate-500" />
                  <span className="text-sm text-slate-500">Thinking...</span>
                </div>
              </div>
            </div>
          )}

          {/* Auto-scroll anchor */}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Section */}
      <div className="p-4 border-t border-white/20 flex-shrink-0">
        <div className="flex gap-3">
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask something about the PDF..."
            className="flex-1 px-4 py-3 bg-white/80 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-slate-400 text-sm"
            disabled={loading}
          />
          <button
            onClick={sendMessage}
            disabled={loading || !query.trim()}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-slate-300 disabled:to-slate-400 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
