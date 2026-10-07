"use client";

import {
  FormEvent,
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import styles from "./Chatbot.module.css";

type Message = {
  id: number;
  role: "user" | "assistant";
  content: string;
};

const suggestedQuestions = [
  "What can you help me with?",
  "Tell me about Hikinhigh",
  "I want to plan a journey",
];

export default function Chatbot() {
  const [open, setOpen] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: "assistant",
      content:
        "Hello, and welcome to Hikinhigh Travels. I’m here to help you discover stays, journeys and experiences around the world. How can I help you today?",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
    }
  }, [open]);

  async function sendMessage(messageText?: string) {
    const text = (messageText ?? input).trim();

    if (!text || loading) {
      return;
    }

    const userMessage: Message = {
      id: Date.now(),
      role: "user",
      content: text,
    };

    const nextMessages = [...messages, userMessage];

    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: nextMessages.map((message) => ({
            role: message.role,
            content: message.content,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Something went wrong while contacting the assistant."
        );
      }

      const assistantMessage: Message = {
        id: Date.now() + 1,
        role: "assistant",
        content:
          data?.message ||
          "I'm sorry, I couldn't generate a response right now.",
      };

      setMessages((current) => [
        ...current,
        assistantMessage,
      ]);
    } catch (error) {
      console.error("Chatbot request failed:", error);

      const errorMessage: Message = {
        id: Date.now() + 1,
        role: "assistant",
        content:
          "I'm sorry, I'm having trouble connecting right now. Please try again in a moment, or contact us at Connect@hikinhigh.com.",
      };

      setMessages((current) => [
        ...current,
        errorMessage,
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void sendMessage();
  }

  function handleKeyDown(
    event: KeyboardEvent<HTMLInputElement>
  ) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
    }
  }

  function clearConversation() {
    setMessages([
      {
        id: Date.now(),
        role: "assistant",
        content:
          "Welcome back. What would you like to explore with Hikinhigh Travels?",
      },
    ]);

    setInput("");
  }

  return (
    <>
      {!open && (
        <button
          type="button"
          className={styles.launcher}
          onClick={() => setOpen(true)}
          aria-label="Open Hikinhigh travel assistant"
          aria-expanded={open}
        >
          <span className={styles.launcherGlow} />

          <span className={styles.launcherIcon}>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M20 11.5a7.5 7.5 0 0 1-7.5 7.5H8l-4 2 .9-4.1A7.5 7.5 0 1 1 20 11.5Z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              <path
                d="M8.5 12h.01M12 12h.01M15.5 12h.01"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
            </svg>
          </span>

          <span className={styles.launcherLabel}>
            Ask Hikinhigh
          </span>
        </button>
      )}

      {open && (
        <section
          className={styles.chatWindow}
          aria-label="Hikinhigh Travel Assistant"
        >
          <header className={styles.header}>
            <div className={styles.headerIdentity}>
              <div className={styles.avatar}>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M4 17.5 9.2 9l3.2 5 2.4-3.4L20 17.5"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  <path
                    d="M7 17.5h13"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              <div>
                <div className={styles.title}>
                  Hikinhigh Assistant
                </div>

                <div className={styles.status}>
                  <span className={styles.statusDot} />
                  <span>Here to help you travel</span>
                </div>
              </div>
            </div>

            <div className={styles.headerActions}>
              <button
                type="button"
                className={styles.iconButton}
                onClick={clearConversation}
                aria-label="Start a new conversation"
                title="New conversation"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M4 6v5h5"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  <path
                    d="M5.2 11A7.5 7.5 0 0 1 18.7 7.2"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />

                  <path
                    d="M20 18v-5h-5"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  <path
                    d="M18.8 13A7.5 7.5 0 0 1 5.3 16.8"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>
              </button>

              <button
                type="button"
                className={styles.iconButton}
                onClick={() => setOpen(false)}
                aria-label="Close assistant"
                title="Close"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M6 6l12 12M18 6 6 18"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>
          </header>

          <div className={styles.conversation}>
            <div className={styles.intro}>
              <span className={styles.introEyebrow}>
                TRAVEL BEYOND THE ORDINARY
              </span>

              <h2>
                Where will
                <br />
                <em>you go next?</em>
              </h2>
            </div>

            <div className={styles.messages}>
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={
                    message.role === "user"
                      ? styles.userRow
                      : styles.assistantRow
                  }
                >
                  {message.role === "assistant" && (
                    <div className={styles.smallAvatar}>
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        aria-hidden="true"
                      >
                        <path
                          d="M4 17.5 9.2 9l3.2 5 2.4-3.4L20 17.5"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  )}

                  <div
                    className={
                      message.role === "user"
                        ? styles.userBubble
                        : styles.assistantBubble
                    }
                  >
                    {message.content}
                  </div>
                </div>
              ))}

              {messages.length === 1 && !loading && (
                <div className={styles.suggestions}>
                  <span className={styles.suggestionsLabel}>
                    YOU MAY ASK
                  </span>

                  {suggestedQuestions.map((question) => (
                    <button
                      type="button"
                      key={question}
                      className={styles.suggestion}
                      onClick={() =>
                        void sendMessage(question)
                      }
                    >
                      <span>{question}</span>
                      <span className={styles.suggestionArrow}>
                        ↗
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {loading && (
                <div className={styles.assistantRow}>
                  <div className={styles.smallAvatar}>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M4 17.5 9.2 9l3.2 5 2.4-3.4L20 17.5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>

                  <div className={styles.typingBubble}>
                    <span />
                    <span />
                    <span />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          <form
            className={styles.composer}
            onSubmit={handleSubmit}
          >
            <div className={styles.inputWrapper}>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(event) =>
                  setInput(event.target.value)
                }
                onKeyDown={handleKeyDown}
                placeholder="Ask about your next journey..."
                disabled={loading}
                autoComplete="off"
                aria-label="Message Hikinhigh Assistant"
              />

              <button
                type="submit"
                className={styles.sendButton}
                disabled={!input.trim() || loading}
                aria-label="Send message"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M21 3 10.5 13.5"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  <path
                    d="m21 3-6.7 18-3.8-7.5L3 9.7 21 3Z"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>

            <div className={styles.disclaimer}>
              Hikinhigh Assistant can make mistakes. For bookings and
              availability, please confirm with our team.
            </div>
          </form>
        </section>
      )}
    </>
  );
}