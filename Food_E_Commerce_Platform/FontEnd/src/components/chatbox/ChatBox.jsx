import React, { useEffect, useState } from "react";
import styles from "./Chatbot.module.css";
import { chatIcon, iconCart, iconSend, sendIcon } from "../icon/Icon";
import { getChat, getQuestion, setChat } from "../../service/chat";
import { useNavigate } from "react-router-dom";
import { formatDateTime } from "../../utils";
import parse from 'html-react-parser'


const MenuList = ({ setShowChat }) => {
  return (
    <div className={styles.chatContainer_icon}>
      <ul className={styles.menuList} onClick={() => setShowChat(true)}>
        <li className={styles.menuItem} style={{ "--i": "#56CCF2", "--j": "#2F80ED" }}>
          <span className={styles.icon} style={{ margin: 0 }}>{chatIcon}</span>
          <span className={styles.title}>Hỏi đáp</span>
        </li>
      </ul>
    </div>
  );
};

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { text: "Hello! How can I assist you today?", sender: "bot" },
    { text: "Hello! I need a Chatbot!", sender: "user" },
  ]);
  const [input, setInput] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [chats, setChats] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [askedQuestions, setAskedQuestions] = useState([]);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  const handleGetQuestion = async () => {
    try {
      const rs = await getQuestion({ showWhen: 'start' })
      setQuestions(rs.data)
    } catch (error) {

    }
  }
  function scrollToBottom() {
    const div = document.getElementById("chat");
    if (div?.scrollHeight) {
      div.scrollTop = div.scrollHeight - 300;
    }

  }

  useEffect(() => {
    if (askedQuestions && questions.length > 0) {
      setQuestions(questions.filter(it => !askedQuestions.includes(it.questionId)))
      scrollToBottom()
    }
  }, [askedQuestions])

  useEffect(() => {
    if (showChat) scrollToBottom()
  }, [showChat])

  const handleGetChat = async () => {
    try {
      const rs = await getChat({ CustomerID: userData.id })
      setChats(rs.data)
      if (rs.data) {
        const list = []
        rs.data.
          forEach(chat => {
            if (chat.questionId) {
              list.push(chat.questionId)
            }
          });
        setAskedQuestions(list)
        scrollToBottom()

      }
    } catch (error) {

    }
  }

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    setUserData(JSON.parse(storedUser))
  }, [])

  useEffect(() => {
    if (userData) {
      handleGetQuestion()
      handleGetChat()
    }

  }, [userData])

  const handleSetChat = async (questionID, content) => {
    try {
      if (userData.id) {
        const rs = await setChat({
          questionID,
          content,
          isChatBot: true,
          customerID: userData.id
        })
        handleGetChat()
        handleGetQuestion()
      } else {
        navigate("/login")
      }
    } catch (error) {
      console.error("error handleSetChat: ", error);

    }
  }

  const handleSend = () => {
    if (!input.trim()) return;
    handleSetChat(0, input)
    setMessages([...messages, { text: input, sender: "user" }]);
    setInput("");
  };


  if (showChat) {
    return (
      <div className={styles.chatContainer}>
        <div className={styles.chatHeader} onClick={() => setShowChat(false)}>
          <h2>Chatbot</h2>
          <div className={styles.onlineStatus}>Trực tuyến</div>
        </div>
        <div className={styles.chatDisplay} id="chat">
          {chats?.map((msg, index) => (<>
            <div
              key={index}
              className={`${styles.chatMessage} ${msg.isChatBot === 'false' ? styles.userMessage : styles.botMessage
                }`}
            >
              {parse(msg?.contentQuestion || msg?.contentAnswer || msg?.content || '')}
            </div>
            {
              msg.isChatBot === 'false' && <div className={styles.createAt}>
                {formatDateTime(msg?.createAt)}
              </div>
            }
          </>
          ))}
          {questions?.length > 0 && questions?.slice(0, 5)?.map((question, index) => (
            <div
              key={index}
              className={`${styles.chatMessage} ${styles.userMessage_question}`}
              onClick={() => handleSetChat(question.questionId, question.content)}
            >
              {question.content}
            </div>
          ))}
        </div>

        <div className={styles.chatInputContainer}>
          <input
            type="text"
            placeholder="Viết yêu cầu ..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className={styles.chatInput}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSend();
              }
            }}
          />
          <button onClick={handleSend} className={styles.sendButton}>
            {sendIcon}
          </button>
        </div>
      </div>
    );
  }
  return <MenuList setShowChat={setShowChat} />

};

export default Chatbot;
