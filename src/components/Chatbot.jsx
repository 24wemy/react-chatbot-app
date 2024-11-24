import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Inisialisasi Gemini API
const genAI = new GoogleGenerativeAI(''); // Ganti dengan API key Anda

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef(null);

  // Auto scroll ke pesan terbaru
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Handle pesan selamat datang
  useEffect(() => {
    const welcomeMessage = {
      sender: 'bot',
      text: 'Halo! Saya adalah asisten AI yang siap membantu Anda. Silakan ajukan pertanyaan apa saja.'
    };
    setMessages([welcomeMessage]);
  }, []);

  const handleTimeQuestions = (question) => {
    const now = new Date();
    
    // Format untuk waktu
    if (question.includes('jam') || question.includes('pukul')) {
      return now.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'short'
      });
    }
    
    // Format untuk tanggal
    if (question.includes('tanggal') || question.includes('hari ini')) {
      return now.toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
    
    return null;
  };

  const generateResponse = async (userInput) => {
    try {
      // Cek apakah pertanyaan tentang waktu
      const timeResponse = handleTimeQuestions(userInput.toLowerCase());
      if (timeResponse) {
        return timeResponse;
      }

      // Jika bukan pertanyaan waktu, gunakan Gemini
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      
      const prompt = `Kamu adalah asisten AI, kamu mempunyai nama Nerop yang profesional dan membantu. Jawab dengan panduan berikut:

1. Berikan jawaban gaul dan responsive sebagai assitent yang handal.
2. Jangan pernah menambahkan informasi waktu/tanggal di jawaban
3. Jangan tambahkan basa-basi yang tidak perlu
4. Jika pertanyaan tidak jelas, minta klarifikasi dengan sopan
5. Jika ditanya hal tidak etis, tolak dengan sopan
6. Gunakan bahasa Indonesia yang baik dan formal
7. Fokus pada inti pertanyaan, hindari informasi tidak relevan
8. Jangan akhiri dengan "ada yang bisa saya bantu?" atau sejenisnya
9. jika ada kata atau kalimat kotor (anjing, babi, tai, asu, pendo, cukimai, fuck you, bangsat, ireng), anda menjawab tolong berikan pertanyaan dengan bahasa yang sopan.
10. jika user mungulang kata atau kalimat yang kotor lagi, response anda, anda terlalu kasar.

Pertanyaan: ${userInput}

Jawaban:`;

      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      console.error('Error:', error);
      return 'Maaf, terjadi kesalahan. Silakan coba lagi nanti.';
    }
  };

  const handleSend = async () => {
    if (input.trim() === '') return;

    // Tambahkan pesan user
    const userMessage = { sender: 'user', text: input.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Dapatkan respons
      const response = await generateResponse(input.trim());
      
      // Tambahkan pesan bot
      const botMessage = {
        sender: 'bot',
        text: response
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error:', error);
      // Tambahkan pesan error
      const errorMessage = {
        sender: 'bot',
        text: 'Maaf, terjadi kesalahan. Silakan coba lagi nanti.'
      };
      setMessages(prev => [...prev, errorMessage]);
    }

    setIsLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg">
        {/* Header */}
        <div className="bg-blue-500 text-white p-4 rounded-t-lg">
          <h2 className="text-xl font-semibold">AI Assistant</h2>
        </div>

        {/* Chat Container */}
        <div 
          ref={chatContainerRef}
          className="h-[500px] overflow-y-auto p-4 space-y-4"
        >
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[70%] p-3 rounded-lg ${
                  msg.sender === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
              </div>
            </div>
          ))}
          
          {/* Loading indicator */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[70%] p-3 rounded-lg bg-gray-100">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Container */}
        <div className="p-4 border-t">
          <div className="flex space-x-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Ketik pesan Anda..."
              className="flex-1 p-2 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="2"
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Kirim
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;