import { create } from "zustand";
import Swal from "sweetalert2";
import axiosInstance from "../lib/axios.js";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const response = await axiosInstance.get("/message/users");
      set({ users: response.data.users });
    } catch (error) {
      console.log("Error getting users:", error.message);

      Swal.fire({
        title: "Oops!",
        text: `${error.response.data.message}`,
        icon: "error",
      });
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (id) => {
    set({ isMessagesLoading: true });
    try {
      const response = await axiosInstance.get(`/message/conversation/${id}`);
      set({ messages: response.data.messages });
    } catch (error) {
      Swal.fire({
        title: "Oops!",
        text: `${error.response.data.message}`,
        icon: "error",
      });
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (data) => {
    const { selectedUser, messages } = get();
    try {
      const response = await axiosInstance.post(
        `/message/sender/${selectedUser._id}`,
        data
      );
      set({ messages: [...messages, response.data.message] });
    } catch (error) {
      Swal.fire({
        title: "Oops!",
        text: `${error.response.data.message}`,
        icon: "error",
      });
    }
  },

  setSelectedUser: (user) => {
    set({ selectedUser: user });
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;
    socket.on("newMessage", (message) => {
      if (message.senderId !== selectedUser._id) return;
      set({ messages: [...get().messages, message] });
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },
}));
