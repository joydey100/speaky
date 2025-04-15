import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import {
  Camera,
  Mail,
  User,
  Trash,
  Loader,
  Pen,
  SendHorizontal,
} from "lucide-react";
import Swal from "sweetalert2";

const ProfilePage = () => {
  const {
    user,
    isUpdatingProfile,
    updateProfilePic,
    removeProfilePic,
    isRemovingProfilePic,
    removeProfile,
    isDeleteProfile,
    isUpdatingName,
    updateProfileName,
  } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);
  const [changeFullName, setChangeFullName] = useState(false);
  const [name, setName] = useState(user.fullName);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // upload less than 10mb
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      Swal.fire({
        title: "Oops! ",
        text: "Image size should be less than 10mb",
        icon: "error",
      });
      return;
    }

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      await updateProfilePic({ profilePic: base64Image });
    };
  };

  const handleDeleteProfile = (e) => {
    e.preventDefault();
    removeProfile();
  };

  const handleNameUpload = (e) => {
    e.preventDefault();

    if (name === user.fullName) {
      setChangeFullName(false);
      Swal.fire({
        title: "Oops! ",
        text: "Name doesn't change",
        icon: "warning",
      });
      return;
    }

    if (name === "") {
      Swal.fire({
        title: "Oops! ",
        text: "Please enter a name",
        icon: "error",
      });
      setName(user.fullName);
      return;
    }

    updateProfileName({ fullName: name });
    setChangeFullName(false);
  };

  return (
    <div className="h-screen pt-20">
      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="bg-base-300 rounded-xl p-6 space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold ">Profile</h1>
            <p className="mt-2">Your profile information</p>
          </div>

          {/* avatar upload section */}

          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={selectedImg || user.profilePic || "/avatar.png"}
                alt="Profile"
                className="size-32 rounded-full object-cover border-4"
              />

              {/* Camera Upload Icon - Bottom Right */}
              <label
                htmlFor="avatar-upload"
                className={`
        absolute bottom-0 right-0 
        bg-base-content hover:scale-105
        p-2 rounded-full cursor-pointer 
        transition-all duration-200
        ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}
      `}
              >
                <Camera className="w-5 h-5 text-base-200" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                />
              </label>

              {/* Trash Icon - Top Right */}
              {(selectedImg || user.profilePic) && (
                <button
                  onClick={async () => {
                    setSelectedImg(null);
                    removeProfilePic();
                  }}
                  className={`
          absolute top-0 right-0 
          bg-error text-white hover:scale-105
          p-2 rounded-full cursor-pointer 
          transition-all duration-200
          ${isUpdatingProfile ? "opacity-40 pointer-events-none" : ""}
        `}
                  aria-label="Remove Photo"
                  title="Remove Photo"
                >
                  {isRemovingProfilePic ? (
                    <Loader className="size-5 animate-spin" />
                  ) : (
                    <Trash className="size-5" />
                  )}
                </button>
              )}
            </div>

            <p className="text-sm text-zinc-400">
              {isUpdatingProfile
                ? "Uploading..."
                : "Click the camera icon to update your photo"}
            </p>
          </div>

          <div className="space-y-6">
            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </div>
              <div className="relative">
                <input
                  className="px-4 py-2.5 bg-base-200 rounded-lg border w-full"
                  name="fullName"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={!changeFullName}
                />
                <div className="absolute inset-y-0 right-0 flex items-center  z-1 p-3">
                  {changeFullName ? (
                    <SendHorizontal
                      className="h-5 w-5 text-accent cursor-pointer"
                      onClick={handleNameUpload}
                    />
                  ) : (
                    <Pen
                      className="h-5 w-5 text-accent cursor-pointer"
                      onClick={() => setChangeFullName(true)}
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">
                {user?.email}
              </p>
            </div>
          </div>

          <div className="mt-6 bg-base-300 rounded-xl p-6">
            <h2 className="text-lg font-medium  mb-4">Account Information</h2>
            <div className="space-y-3 sm:text-md text-sm">
              <div className="flex items-center justify-between py-2 ">
                <span>Member Since</span>
                <span>{user.createdAt?.split("T")[0]}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span>Account Status</span>
                <span className="bg-green-600 px-4 py-2 text-white rounded">
                  Active
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span>Delete profile</span>
                <button
                  className={`bg-red-500 cursor-pointer text-white px-4 py-2 rounded ${
                    isDeleteProfile && "disabled"
                  }`}
                  onClick={handleDeleteProfile}
                >
                  {isDeleteProfile ? (
                    <Loader className="size-5 animate-spin" />
                  ) : (
                    "Delete"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProfilePage;
