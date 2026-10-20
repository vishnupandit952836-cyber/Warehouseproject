import React, { useEffect, useRef, useState } from "react";

import {
  MdSmartToy,
  MdSend,
  MdAdd,
  MdDelete,
  MdHistory,
  MdClose,
} from "react-icons/md";

const AI_Helper = () => {
  // =========================================================
  // MESSAGE INPUT
  // =========================================================

  const [message, setMessage] = useState("");

  // =========================================================
  // ACTIVE CHAT ID
  // =========================================================

  const [activeChatId, setActiveChatId] = useState(1);

  // =========================================================
  // AUTO SCROLL
  // =========================================================

  const messagesEndRef = useRef(null);

  // =========================================================
  // CHAT HISTORY
  // =========================================================

  const [history, setHistory] = useState([
    {
      id: 1,
      title: "Warehouse Status",
      messages: [
        {
          id: 101,
          sender: "ai",
          text: "Hello! 👋 I'm your AI Helper. How can I help you today?",
        },
        {
          id: 102,
          sender: "user",
          text: "Show me the warehouse status.",
        },
        {
          id: 103,
          sender: "ai",
          text: "Your warehouse is operating normally. Inventory and orders are available.",
        },
      ],
    },

    {
      id: 2,
      title: "Low Stock Check",
      messages: [
        {
          id: 201,
          sender: "ai",
          text: "Hello! 👋 How can I help you with stock information?",
        },
        {
          id: 202,
          sender: "user",
          text: "Check low stock products.",
        },
        {
          id: 203,
          sender: "ai",
          text: "There are 24 products currently running low on stock.",
        },
      ],
    },

    {
      id: 3,
      title: "Today's Orders",
      messages: [
        {
          id: 301,
          sender: "ai",
          text: "Hello! 👋 I can help you with today's orders.",
        },
        {
          id: 302,
          sender: "user",
          text: "Show today's orders.",
        },
        {
          id: 303,
          sender: "ai",
          text: "You currently have multiple orders to process today.",
        },
      ],
    },
  ]);

  // =========================================================
  // CURRENT CHAT MESSAGES
  // =========================================================

  const [messages, setMessages] = useState(
    history.find((chat) => chat.id === activeChatId)?.messages || []
  );

  // =========================================================
  // ACTIVE CHAT
  // =========================================================

  const activeChat = history.find(
    (chat) => chat.id === activeChatId
  );

  // =========================================================
  // AUTO SCROLL TO LATEST MESSAGE
  // =========================================================

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  // =========================================================
  // UPDATE CHAT HISTORY
  // =========================================================

  const updateHistory = (chatMessages, chatTitle = null) => {
    setHistory((previousHistory) =>
      previousHistory.map((chat) =>
        chat.id === activeChatId
          ? {
              ...chat,
              messages: chatMessages,
              ...(chatTitle ? { title: chatTitle } : {}),
            }
          : chat
      )
    );
  };

  // =========================================================
  // AI RESPONSE
  // =========================================================

  const getAIResponse = (text) => {
    const lowerText = text.toLowerCase();

    if (
      lowerText.includes("stock") ||
      lowerText.includes("inventory")
    ) {
      return "Sure! I can help you check inventory and stock levels. Some products may require restocking.";
    }

    if (
      lowerText.includes("order") ||
      lowerText.includes("orders")
    ) {
      return "Sure! I can help you with today's orders, pending orders and order information.";
    }

    if (
      lowerText.includes("warehouse") ||
      lowerText.includes("status")
    ) {
      return "Your warehouse is operating normally. You can check inventory, products and orders for more details.";
    }

    if (lowerText.includes("product")) {
      return "I can help you with product information, product quantity, stock levels and product management.";
    }

    if (lowerText.includes("supplier")) {
      return "I can help you with supplier information and supplier management.";
    }

    return "Sure! I can help you with inventory, products, orders, stock levels and warehouse information.";
  };

  // =========================================================
  // SEND MESSAGE
  // =========================================================

  const sendMessage = () => {
    if (!message.trim()) return;

    const userText = message.trim();

    const userMessage = {
      id: Date.now(),
      sender: "user",
      text: userText,
    };

    const updatedMessages = [
      ...messages,
      userMessage,
    ];

    // Add user message
    setMessages(updatedMessages);

    // =======================================================
    // CHAT NAME
    // First user question becomes history name
    // =======================================================

    const currentChat = history.find(
      (chat) => chat.id === activeChatId
    );

    let chatTitle = currentChat?.title || "New Chat";

    if (
      currentChat?.title === "New Chat" ||
      currentChat?.title === "New Chat"
    ) {
      chatTitle =
        userText.length > 28
          ? userText.substring(0, 28) + "..."
          : userText;
    }

    // Save message + title in history
    updateHistory(updatedMessages, chatTitle);

    // Clear input
    setMessage("");

    // =======================================================
    // AI RESPONSE
    // =======================================================

    setTimeout(() => {
      const aiMessage = {
        id: Date.now() + 1,
        sender: "ai",
        text: getAIResponse(userText),
      };

      setMessages((previousMessages) => {
        const newMessages = [
          ...previousMessages,
          aiMessage,
        ];

        setHistory((previousHistory) =>
          previousHistory.map((chat) =>
            chat.id === activeChatId
              ? {
                  ...chat,
                  messages: newMessages,
                }
              : chat
          )
        );

        return newMessages;
      });
    }, 600);
  };

  // =========================================================
  // ENTER KEY
  // =========================================================

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  // =========================================================
  // OPEN HISTORY CHAT
  // =========================================================

  const openHistoryChat = (chat) => {
    setActiveChatId(chat.id);
    setMessages(chat.messages);
    setMessage("");
  };

  // =========================================================
  // NEW CHAT
  // =========================================================

  const newChat = () => {
    const newId = Date.now();

    const newMessages = [
      {
        id: newId + 1,
        sender: "ai",
        text: "Hello! 👋 I'm your AI Helper. How can I help you today?",
      },
    ];

    const newChatItem = {
      id: newId,
      title: "New Chat",
      messages: newMessages,
    };

    setHistory((previousHistory) => [
      newChatItem,
      ...previousHistory,
    ]);

    setActiveChatId(newId);

    setMessages(newMessages);

    setMessage("");
  };

  // =========================================================
  // DELETE SINGLE CHAT
  // =========================================================

  const deleteChat = (chatId) => {
    const updatedHistory = history.filter(
      (chat) => chat.id !== chatId
    );

    setHistory(updatedHistory);

    if (chatId === activeChatId) {
      if (updatedHistory.length > 0) {
        const firstChat = updatedHistory[0];

        setActiveChatId(firstChat.id);

        setMessages(firstChat.messages);
      } else {
        setActiveChatId(null);

        setMessages([]);
      }

      setMessage("");
    }
  };

  // =========================================================
  // CLEAR ALL HISTORY
  // =========================================================

  const clearHistory = () => {
    setHistory([]);

    setActiveChatId(null);

    setMessages([]);

    setMessage("");
  };

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="h-screen bg-gray-100 pt-1 overflow-hidden">

      {/* =====================================================
          PAGE HEADER
      ====================================================== */}

      <div className="max-w-5xl mx-auto mb-2">

        <h1 className="text-2xl font-semibold text-gray-800">
          AI Helper
        </h1>

        <p className="text-sm font-medium text-gray-500 mt-1">
          Your smart assistant for warehouse management
        </p>

      </div>

      {/* =====================================================
          MAIN CHAT BOX
      ====================================================== */}

      <div
        className="
          max-w-5xl
          mx-auto
          h-[calc(100vh-100px)]
          bg-white
          rounded-xl
          border
          border-gray-200
          shadow-md
          overflow-hidden
        "
      >

        <div className="flex h-full">

          {/* =================================================
              HISTORY SIDEBAR
          ================================================= */}

          <aside
            className="
              hidden
              md:flex
              w-56
              shrink-0
              flex-col
              bg-gray-50
              border-r
              border-gray-200
            "
          >

            {/* HISTORY HEADER */}

            <div className="p-3 border-b border-gray-200">

              <div className="flex items-center gap-2">

                <div
                  className="
                    w-8
                    h-8
                    rounded-lg
                    bg-blue-100
                    flex
                    items-center
                    justify-center
                  "
                >

                  <MdHistory className="text-lg text-blue-600" />

                </div>

                <div>

                  <h2 className="text-sm font-semibold text-gray-800">
                    Chat History
                  </h2>

                  <p className="text-xs font-medium text-gray-400">
                    {history.length} chats
                  </p>

                </div>

              </div>

              {/* NEW CHAT */}

              <button
                onClick={newChat}
                className="
                  mt-3
                  w-full
                  flex
                  items-center
                  justify-center
                  gap-2
                  bg-blue-600
                  hover:bg-blue-700
                  text-white
                  text-sm
                  font-medium
                  py-2
                  rounded-lg
                  transition
                "
              >

                <MdAdd className="text-lg" />

                New Chat

              </button>

            </div>

            {/* =================================================
                HISTORY LIST
            ================================================= */}

            <div className="flex-1 overflow-y-auto p-2">

              {history.length === 0 ? (

                <div className="h-full flex items-center justify-center text-center">

                  <div>

                    <MdHistory className="text-3xl text-gray-300 mx-auto" />

                    <p className="text-sm font-medium text-gray-400 mt-2">
                      No chat history
                    </p>

                  </div>

                </div>

              ) : (

                <div className="space-y-1">

                  {history.map((chat) => (

                    <div
                      key={chat.id}
                      className={`
                        group
                        flex
                        items-center
                        rounded-lg
                        transition
                        ${
                          activeChatId === chat.id
                            ? "bg-blue-100"
                            : "hover:bg-white"
                        }
                      `}
                    >

                      {/* OPEN CHAT */}

                      <button
                        onClick={() =>
                          openHistoryChat(chat)
                        }
                        className="
                          flex-1
                          min-w-0
                          text-left
                          px-2
                          py-2
                        "
                      >

                        <div className="flex items-center gap-2">

                          <div
                            className={`
                              w-7
                              h-7
                              shrink-0
                              rounded-md
                              flex
                              items-center
                              justify-center
                              ${
                                activeChatId === chat.id
                                  ? "bg-blue-600"
                                  : "bg-gray-200"
                              }
                            `}
                          >

                            <MdSmartToy
                              className={`
                                text-sm
                                ${
                                  activeChatId === chat.id
                                    ? "text-white"
                                    : "text-gray-500"
                                }
                              `}
                            />

                          </div>

                          <div className="min-w-0">

                            {/* CHAT NAME */}

                            <p
                              className={`
                                text-xs
                                font-medium
                                truncate
                                ${
                                  activeChatId === chat.id
                                    ? "text-blue-700"
                                    : "text-gray-700"
                                }
                              `}
                            >
                              {chat.title}
                            </p>

                            <p className="text-[11px] text-gray-400">
                              {chat.messages.length} messages
                            </p>

                          </div>

                        </div>

                      </button>

                      {/* DELETE */}

                      <button
                        onClick={() =>
                          deleteChat(chat.id)
                        }
                        className="
                          opacity-0
                          group-hover:opacity-100
                          p-1
                          mr-1
                          text-gray-400
                          hover:text-red-500
                          transition
                        "
                        title="Delete chat"
                      >

                        <MdDelete className="text-base" />

                      </button>

                    </div>

                  ))}

                </div>

              )}

            </div>

            {/* =================================================
                CLEAR HISTORY
            ================================================= */}

            {history.length > 0 && (

              <div className="p-3 border-t border-gray-200">

                <button
                  onClick={clearHistory}
                  className="
                    w-full
                    flex
                    items-center
                    justify-center
                    gap-2
                    py-2
                    rounded-lg
                    bg-red-50
                    text-red-500
                    hover:bg-red-100
                    text-xs
                    font-medium
                    transition
                  "
                >

                  <MdDelete className="text-base" />

                  Clear History

                </button>

              </div>

            )}

          </aside>

          {/* =================================================
              CHAT AREA
          ================================================= */}

          <section className="flex-1 min-w-0 flex flex-col">

            {/* =================================================
                BLUE CHAT HEADER
                HEIGHT REDUCED
            ================================================= */}

            <header
              className="
                shrink-0
                px-4
                py-2
                bg-blue-600
                flex
                items-center
                justify-between
              "
            >

              <div className="flex items-center gap-2.5">

                {/* SMALLER ICON */}

                <div
                  className="
                    w-8
                    h-8
                    rounded-lg
                    bg-white
                    flex
                    items-center
                    justify-center
                  "
                >

                  <MdSmartToy className="text-lg text-blue-600" />

                </div>

                <div>

                  <h2 className="text-base font-semibold text-white">
                    AI Helper
                  </h2>

                  <div className="flex items-center gap-1.5">

                    <span className="w-1.5 h-1.5 rounded-full bg-green-300"></span>

                    <span className="text-xs font-medium text-white/80">
                      Online • Ready to help
                    </span>

                  </div>

                </div>

              </div>

              {/* CURRENT CHAT */}

              <div className="hidden sm:block text-right">

                <p className="text-[11px] font-medium text-white/70">
                  Current Chat
                </p>

                <p className="text-sm font-medium text-white max-w-[160px] truncate">
                  {activeChat?.title || "New Chat"}
                </p>

              </div>

            </header>

            {/* =================================================
                MESSAGE AREA
            ================================================= */}

            <div
              className="
                flex-1
                min-h-0
                overflow-y-auto
                bg-gray-50
                px-4
                py-4
                space-y-4
              "
            >

              {messages.length === 0 ? (

                <div className="h-full flex items-center justify-center">

                  <div className="text-center">

                    <div
                      className="
                        w-14
                        h-14
                        mx-auto
                        rounded-xl
                        bg-blue-100
                        flex
                        items-center
                        justify-center
                      "
                    >

                      <MdSmartToy className="text-3xl text-blue-600" />

                    </div>

                    <h3 className="text-base font-semibold text-gray-700 mt-3">
                      Start a new conversation
                    </h3>

                    <p className="text-sm font-medium text-gray-400 mt-1">
                      Ask me anything about your warehouse.
                    </p>

                  </div>

                </div>

              ) : (

                messages.map((msg) => (

                  <div
                    key={msg.id}
                    className={`
                      flex
                      ${
                        msg.sender === "user"
                          ? "justify-end"
                          : "justify-start"
                      }
                    `}
                  >

                    <div
                      className={`
                        flex
                        items-start
                        gap-2
                        max-w-[72%]
                        ${
                          msg.sender === "user"
                            ? "flex-row-reverse"
                            : ""
                        }
                      `}
                    >

                      {/* AVATAR */}

                      <div
                        className={`
                          w-8
                          h-8
                          shrink-0
                          rounded-lg
                          flex
                          items-center
                          justify-center
                          ${
                            msg.sender === "ai"
                              ? "bg-blue-600"
                              : "bg-gray-700"
                          }
                        `}
                      >

                        {msg.sender === "ai" ? (

                          <MdSmartToy className="text-base text-white" />

                        ) : (

                          <span className="text-xs font-semibold text-white">
                            U
                          </span>

                        )}

                      </div>

                      {/* MESSAGE BUBBLE */}

                      <div
                        className={`
                          px-3.5
                          py-2.5
                          rounded-xl
                          text-sm
                          font-medium
                          leading-relaxed
                          shadow-sm
                          ${
                            msg.sender === "user"
                              ? "bg-blue-600 text-white rounded-tr-sm"
                              : "bg-white text-gray-700 border border-gray-200 rounded-tl-sm"
                          }
                        `}
                      >

                        {msg.text}

                      </div>

                    </div>

                  </div>

                ))

              )}

              {/* AUTO SCROLL */}

              <div ref={messagesEndRef} />

            </div>

            {/* =================================================
                INPUT AREA
            ================================================= */}

            <div
              className="
                shrink-0
                bg-white
                border-t
                border-gray-200
                p-3
              "
            >

              <div
                className="
                  flex
                  items-center
                  gap-2
                  border
                  border-gray-400
                  rounded-xl
                  bg-gray-50
                  px-3
                  py-1.5
                  focus-within:border-blue-500
                  focus-within:ring-2
                  focus-within:ring-blue-100
                  transition
                "
              >

                <input
                  type="text"
                  value={message}
                  onChange={(e) =>
                    setMessage(e.target.value)
                  }
                  onKeyDown={handleKeyDown}
                  placeholder="Ask AI Helper..."
                  className="
                    flex-1
                    bg-transparent
                    px-2
                    py-2.5
                    text-sm
                    font-medium
                    text-gray-700
                    outline-none
                    placeholder:text-gray-400
                  "
                />

                {message && (

                  <button
                    onClick={() => setMessage("")}
                    className="
                      p-1.5
                      text-gray-400
                      hover:text-gray-600
                    "
                    title="Clear"
                  >

                    <MdClose className="text-lg" />

                  </button>

                )}

                <button
                  onClick={sendMessage}
                  disabled={!message.trim()}
                  className="
                    w-10
                    h-10
                    shrink-0
                    rounded-lg
                    bg-blue-600
                    hover:bg-blue-700
                    disabled:bg-gray-300
                    disabled:cursor-not-allowed
                    flex
                    items-center
                    justify-center
                    text-white
                    transition
                  "
                  title="Send"
                >

                  <MdSend className="text-lg" />

                </button>

              </div>

              <div className="flex justify-between mt-1.5 px-1">

                <p className="text-xs font-medium text-gray-400">
                  Press Enter to send
                </p>

                <p className="hidden sm:block text-xs font-medium text-gray-400">
                  AI Helper • Warehouse Management
                </p>

              </div>

            </div>

          </section>

        </div>

      </div>

    </div>
  );
};

export default AI_Helper;