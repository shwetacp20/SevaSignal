import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Sparkles, ExternalLink, ShieldCheck, Trash2, Bot, User, ArrowRight, FileText } from "lucide-react";
import { sendChatMessage, fetchGuidance } from "../services/api";

export default function ChatAssistant({ isOpen, onClose, initialQuery, onOpenGuidanceCard, t, lang }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: t.chat.subtitle,
      sources: [],
      isWelcome: true
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  useEffect(() => {
    if (initialQuery && initialQuery.trim()) {
      handleSend(initialQuery);
    }
  }, [initialQuery]);

  const handleSend = async (textToSend = null) => {
    const q = textToSend || input;
    if (!q || !q.trim() || loading) return;

    const userMsg = { role: "user", content: q.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const history = messages.filter(m => !m.isWelcome).map(m => ({ role: m.role, content: m.content }));
      const res = await sendChatMessage(q.trim(), lang, null, null, history);
      
      const botMsg = {
        role: "assistant",
        content: res.answer,
        sources: res.sources || [],
        identified_service: res.identified_service,
        verification_status: res.verification_status,
        last_verified: res.last_verified,
        suggested_steps: res.suggested_steps || [],
        is_fallback: res.is_fallback
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I encountered a temporary connection issue. Please check official government portals directly.",
          sources: []
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setMessages([
      {
        role: "assistant",
        content: t.chat.subtitle,
        sources: [],
        isWelcome: true
      }
    ]);
  };

  const handleOpenPlanForService = async (serviceName, lastQuestion) => {
    try {
      const card = await fetchGuidance(null, null, serviceName || lastQuestion, lang);
      if (onOpenGuidanceCard) {
        onOpenGuidanceCard(card);
      }
    } catch (e) {
      console.warn("Could not generate plan from chat:", e);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="chat-drawer-container" role="dialog" aria-modal="true">
      <div className="chat-drawer">
        {/* Chat Drawer Header */}
        <div className="chat-header">
          <div className="chat-header-title">
            <div className="bot-avatar-badge">
              <Sparkles size={18} />
            </div>
            <div>
              <h3>{t.chat.title}</h3>
              <span className="chat-status-indicator">● Grounded in official sources</span>
            </div>
          </div>
          <div className="chat-header-actions">
            <button 
              type="button" 
              className="chat-action-btn"
              onClick={handleClear}
              title={t.chat.clearChat}
            >
              <Trash2 size={16} />
            </button>
            <button 
              type="button" 
              className="chat-action-btn"
              onClick={onClose}
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Quick prompt pills */}
        <div className="chat-quick-prompts">
          {t.chat.quickPrompts?.map((prompt, i) => (
            <button
              key={i}
              type="button"
              className="chat-prompt-pill"
              onClick={() => handleSend(prompt)}
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Messages scroll area */}
        <div className="chat-messages-scroll">
          {messages.map((m, idx) => (
            <div key={idx} className={`chat-message-row ${m.role}`}>
              <div className="message-avatar">
                {m.role === "assistant" ? <Bot size={16} /> : <User size={16} />}
              </div>
              <div className="message-bubble">
                <div className="message-text" style={{ whiteSpace: "pre-line" }}>
                  {m.content}
                </div>

                {/* Interactive Action Plan Button for identified public service */}
                {m.role === "assistant" && !m.isWelcome && m.identified_service && (
                  <div className="chat-action-plan-cta">
                    <button
                      type="button"
                      className="btn-chat-plan"
                      onClick={() => handleOpenPlanForService(m.identified_service, messages[idx - 1]?.content)}
                    >
                      <FileText size={14} />
                      <span>{t.panel?.getGuidance || "Get Complete Action Plan"}</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                )}

                {/* Sources & Badges for Bot message */}
                {m.sources && m.sources.length > 0 && (
                  <div className="bot-sources-box">
                    <span className="sources-label">Verified Official Portals:</span>
                    <div className="sources-chips-row">
                      {m.sources.map((src, sIdx) => (
                        <a
                          key={sIdx}
                          href={src.url}
                          target="_blank"
                          rel="noreferrer"
                          className="source-chip-link"
                        >
                          <ShieldCheck size={13} color="#059669" />
                          <span>{src.title}</span>
                          <ExternalLink size={11} />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="chat-message-row assistant">
              <div className="message-avatar">
                <Bot size={16} />
              </div>
              <div className="message-bubble loading-bubble">
                <div className="typing-dots">
                  <span></span><span></span><span></span>
                </div>
                <span className="typing-label">{t.chat.thinking}</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat input form */}
        <form 
          className="chat-input-bar"
          onSubmit={e => {
            e.preventDefault();
            handleSend();
          }}
        >
          <input
            type="text"
            className="chat-input-field"
            placeholder={t.chat.placeholder}
            value={input}
            onChange={e => setInput(e.target.value)}
          />
          <button 
            type="submit" 
            className="chat-send-btn"
            disabled={!input.trim() || loading}
            aria-label={t.chat.send}
          >
            <Send size={16} />
          </button>
        </form>

        <div className="chat-footer-disclaimer">
          <span>{t.chat.disclaimer}</span>
        </div>
      </div>
    </div>
  );
}
