import useWebSocketLib from 'react-use-websocket';
import { useAuthStore } from '../store/authStore';
import { useChatStore } from '../store/chatStore';
import { useEffect, useCallback } from 'react';

const getWebSocketUrl = (chatId, token) => {
  if (!chatId || !token) return null;
  if (import.meta.env.VITE_WS_URL) {
    const base = import.meta.env.VITE_WS_URL.replace(/\/+$/, '');
    return `${base}/chat/${chatId}/?token=${token}`;
  }
  const apiUrl = import.meta.env.VITE_API_URL;
  if (apiUrl && !apiUrl.includes('localhost')) {
    const wsProto = apiUrl.startsWith('https') ? 'wss:' : 'ws:';
    const cleanHost = apiUrl.replace(/^https?:\/\//, '').replace(/\/api\/?$/, '').replace(/\/+$/, '');
    return `${wsProto}//${cleanHost}/ws/chat/${chatId}/?token=${token}`;
  }
  return `ws://localhost:8000/ws/chat/${chatId}/?token=${token}`;
};

export const useWebSocket = (chatId) => {
  const token = useAuthStore((state) => state.accessToken);
  const addMessage = useChatStore((state) => state.addMessage);
  const markOutgoingAsRead = useChatStore((state) => state.markOutgoingAsRead);

  const { sendMessage, lastMessage, readyState } = useWebSocketLib(
    getWebSocketUrl(chatId, token),
    {
      shouldReconnect: () => true,
    }
  );

  useEffect(() => {
    if (lastMessage !== null) {
      try {
        const data = JSON.parse(lastMessage.data);
        
        // Yangi xabar kelganda
        if (data.type === 'chat_message' || data.type === 'message') {
          const msgObj = data.message || data.data;
          if (msgObj) {
            addMessage(chatId, msgObj);
          }
        }

        // Xabarlar o'qilganda: FAQAT SUHBATDOSH o'qiganda bizning galichkalar 2 ta bo'ladi
        if (data.type === 'messages_read' || data.type === 'read') {
          const readerId = data.reader_id || data.user_id;
          const currentUserId = useAuthStore.getState().user?.id;
          if (readerId && currentUserId && readerId !== currentUserId) {
            markOutgoingAsRead(chatId);
          }
        }
      } catch (error) {
        console.error('WebSocket message parsing error:', error);
      }
    }
  }, [lastMessage, chatId, addMessage, markOutgoingAsRead]);

  const sendChatMessage = useCallback((text) => {
    if (!text) return;
    sendMessage(JSON.stringify({ type: 'message', content: text, message: text }));
  }, [sendMessage]);

  const sendReadReceipt = useCallback((messageId = null) => {
    sendMessage(JSON.stringify({ type: 'read_receipt', message_id: messageId }));
  }, [sendMessage]);

  return {
    sendChatMessage,
    sendReadReceipt,
    readyState,
  };
};
