import { create } from "zustand";
import axiosInstance from "../lib/axios.js";
import Swal from "sweetalert2";
import { io } from "socket.io-client";

const BASE_URL =
  import.meta.env.MODE === "development" ? "http://localhost:3000/" : "/";

export const useAuthStore = create((set, get) => ({
  user: null,
  isCheckingAuth: true,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isRemovingProfilePic: false,
  onlineUsers: [],
  socket: null,
  isDeleteProfile: false,
  isUpdatingName: false,

  checkAuth: async () => {
    try {
      const response = await axiosInstance.get("/auth/me");
      set({ user: response.data.user });
      get().connectSocket();
    } catch (error) {
      set({ user: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const response = await axiosInstance.post("/auth/signup", data);
      set({ user: response.data.user });
      Swal.fire({
        title: `Signup complete!`,
        text: "Account created successfully",
        icon: "success",
      });
      get().connectSocket();
    } catch (error) {
      Swal.fire({
        title: "Oops!",
        text: `${error.response?.data?.message || "Something went wrong."}`,
        icon: "error",
      });
    } finally {
      set({ isSigningUp: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ user: null });
      Swal.fire({
        title: "See you soon! ",
        text: "Logged out successfully",
        icon: "success",
      });
      get().disconnectSocket();
    } catch (error) {
      console.log("Error logging out:", error);
      Swal.fire({
        title: "Oops!",
        text: `${error.response.data.message}`,
        icon: "error",
      });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const response = await axiosInstance.post("/auth/login", data);
      set({ user: response.data.user });

      Swal.fire({
        title: "Login successful!",
        text: "Let’s get back to it ",
        icon: "success",
      });
      get().connectSocket();
    } catch (error) {
      Swal.fire({
        title: "Oops!",
        text: `${error.response.data.message}`,
        icon: "error",
      });
    } finally {
      set({ isLoggingIn: false });
    }
  },

  connectSocket: () => {
    const { user } = get();
    if (!user || get().socket?.connected) return;
    const socket = io(BASE_URL, {
      query: { userId: user._id },
    });
    socket.connect();
    set({ socket });

    socket.on("getOnlineUsers", (onlineUsers) => {
      set({ onlineUsers });
    });
  },

  disconnectSocket: () => {
    if (!get().socket?.connected) return;
    get().socket.disconnect();
  },

  updateProfilePic: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const response = await axiosInstance.put("/auth/updateprofilepic", data);
      set({ user: response.data.user });
      Swal.fire({
        title: "Profile updated!",
        text: "Your changes have been saved ",
        icon: "success",
      });
    } catch (error) {
      Swal.fire({
        title: "Oops!",
        text: `${error.response.data.message}`,
        icon: "error",
      });
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  updateProfileName: async (data) => {
    set({ isUpdatingName: true });
    try {
      const response = await axiosInstance.put("/auth/updateprofilename", data);
      set({ user: response.data.user });
      Swal.fire({
        title: "Profile updated!",
        text: "Your changes have been saved ",
        icon: "success",
      });
    } catch (error) {
      Swal.fire({
        title: "Oops!",
        text: `${error.response.data.message}`,
        icon: "error",
      });
    } finally {
      set({ isUpdatingName: false });
    }
  },

  removeProfilePic: async () => {
    set({ isRemovingProfilePic: true });
    try {
      const response = await axiosInstance.delete("/auth/remove-profile-pic");
      set({ user: response.data.user });
      Swal.fire({
        title: "Profile picture removed!",
        text: "Your photo has been cleared",
        icon: "success",
      });
    } catch (error) {
      Swal.fire({
        title: "Oops!",
        text: `${error.response.data.message}`,
        icon: "error",
      });
    } finally {
      set({ isRemovingProfilePic: false });
    }
  },

  removeProfile: async () => {
    const { user } = get();
    set({ isDeleteProfile: true });

    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "bg-gray-600",
        confirmButtonText: "Yes, delete it!",
      });

      if (result.isConfirmed) {
        await axiosInstance.delete(`/auth/delete-profile/${user._id}`);
        set({ user: null });

        await Swal.fire({
          title: "Profile deleted!",
          text: "Successfully removed profile",
          icon: "success",
        });

        get().disconnectSocket();
      } else {
        return;
      }
    } catch (error) {
      console.log("Error removing profile:", error.message);
      Swal.fire({
        title: "Oops!",
        text: `${error.response?.data?.message || "Something went wrong."}`,
        icon: "error",
      });
    } finally {
      set({ isDeleteProfile: false });
    }
  },
}));
