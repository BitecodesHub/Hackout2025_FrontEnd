import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

export const UpdateProfile = () => {
  const navigate = useNavigate();
  const userId = sessionStorage.getItem("userId");
  const token = sessionStorage.getItem("authToken");
  const [userData, setUserData] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [selectedSkillIds, setSelectedSkillIds] = useState([]);

  const apiUrl =
    process.env.REACT_APP_ENV === "production"
      ? process.env.REACT_APP_LIVE_API
      : process.env.REACT_APP_LOCAL_API;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!userId || !token) {
          setError("Please log in to update your profile.");
          navigate("/");
          return;
        }

        const response = await axios.get(`${apiUrl}/api/auth/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        if (response.data) {
          setUserData(response.data);
          // Initialize selectedSkillIds from skillIds or skills
          const skillIds = response.data.skillIds || 
            (response.data.skills ? response.data.skills.map((s) => s.id) : []);
          setSelectedSkillIds(skillIds);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("Failed to load profile data.");
      }
    };

   
    fetchUserData();
  }, [userId, token, apiUrl, navigate]);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProfileImage(file);
    }
  };

  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    setError("");
    setSuccess(false);

    const formData = new FormData(e.target);
    const userDataUpdated = Object.fromEntries(formData);
    let newProfileUrl = userData.profileurl;

    try {
      // Upload image if selected
      if (profileImage) {
        const imageForm = new FormData();
        imageForm.append("thumbnailUrl", profileImage);

        const uploadResponse = await axios.post(`${apiUrl}/upload/profilephoto`, imageForm, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });

        newProfileUrl = uploadResponse.data;
      }

      // Prepare updated user object
      const updatedUser = {
        username: userDataUpdated.username,
        name: userDataUpdated.fullName,
        email: userDataUpdated.email,
        phonenum: userDataUpdated.phone,
        state: userDataUpdated.state,
        profileurl: newProfileUrl,
        bio: userDataUpdated.bio,
        timezone: userDataUpdated.timezone,
        availability: userDataUpdated.availability,
        role: userDataUpdated.role || null,
        skillIds: selectedSkillIds, // Send as [1, 2, ...]
      };

      console.log("Sending update payload:", updatedUser);

      // Send update request
      const response = await axios.put(`${apiUrl}/api/auth/update/${userId}`, updatedUser, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        setSuccess(true);
        setTimeout(() => {
          navigate("/profile");
        }, 2000);
      }
    } catch (error) {
      console.error("Update failed:", error.response?.data || error.message);
      setError("Failed to update profile: " + (error.response?.data?.message || "Please try again."));
    } finally {
      setIsUpdating(false);
    }
  };

  

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500/20 via-purple-400/20 to-blue-400/20 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-gray-600 dark:text-gray-400 text-lg font-semibold"
        >
          Loading profile...
        </motion.p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500/20 via-purple-400/20 to-blue-400/20 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950 p-4 sm:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden"
      >
        <div className="p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">
            Update Your Profile
          </h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Image */}
            <div className="flex flex-col items-center mb-6">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.4 }}
                className="relative"
              >
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-indigo-100 dark:border-gray-700 shadow-md">
                  <img
                    src={
                      profileImage
                        ? URL.createObjectURL(profileImage)
                        : userData.profileurl || "https://webcrumbs.cloud/placeholder"
                    }
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <label
                  html melodicFor="profilePhoto"
                  className="absolute -bottom-2 right-0 bg-indigo-500 dark:bg-indigo-600 p-2 rounded-full cursor-pointer hover:bg-indigo-600 dark:hover:bg-indigo-700 transition-colors"
                >
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2m-4-4l-4-4m0 0l-4 4m4-4v12"
                    ></path>
                  </svg>
                  <input
                    type="file"
                    id="profilePhoto"
                    name="profilePhoto"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
              </motion.div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  defaultValue={userData.name}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:outline-none transition-all"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  defaultValue={userData.username}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:outline-none transition-all"
                  placeholder="Choose a username"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  defaultValue={userData.email}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-600 text-gray-500 dark:text-gray-400 rounded-lg cursor-not-allowed"
                  disabled
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  defaultValue={userData.phonenum}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:outline-none transition-all"
                  placeholder="Enter your phone number"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  State
                </label>
                <select
                  name="state"
                  defaultValue={userData.state}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:outline-none transition-all"
                >
                  <option value="">Select your state</option>
                  <option value="Andhra Pradesh">Andhra Pradesh</option>
                  <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                  <option value="Assam">Assam</option>
                  <option value="Bihar">Bihar</option>
                  <option value="Chhattisgarh">Chhattisgarh</option>
                  <option value="Goa">Goa</option>
                  <option value="Gujarat">Gujarat</option>
                  <option value="Haryana">Haryana</option>
                  <option value="Himachal Pradesh">Himachal Pradesh</option>
                  <option value="Jharkhand">Jharkhand</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Kerala">Kerala</option>
                  <option value="Madhya Pradesh">Madhya Pradesh</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Manipur">Manipur</option>
                  <option value="Meghalaya">Meghalaya</option>
                  <option value="Mizoram">Mizoram</option>
                  <option value="Nagaland">Nagaland</option>
                  <option value="Odisha">Odisha</option>
                  <option value="Punjab">Punjab</option>
                  <option value="Rajasthan">Rajasthan</option>
                  <option value="Sikkim">Sikkim</option>
                  <option value="Tamil Nadu">Tamil Nadu</option>
                  <option value="Telangana">Telangana</option>
                  <option value="Tripura">Tripura</option>
                  <option value="Uttar Pradesh">Uttar Pradesh</option>
                  <option value="Uttarakhand">Uttarakhand</option>
                  <option value="West Bengal">West Bengal</option>
                  <option disabled>───────────</option>
                  <option value="Andaman and Nicobar Islands">Andaman and Nicobar Islands</option>
                  <option value="Chandigarh">Chandigarh</option>
                  <option value="Dadra and Nagar Haveli and Daman and Diu">
                    Dadra and Nagar Haveli and Daman and Diu
                  </option>
                  <option value="Lakshadweep">Lakshadweep</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Puducherry">Puducherry</option>
                  <option value="Ladakh">Ladakh</option>
                  <option value="Jammu and Kashmir">Jammu and Kashmir</option>
                </select>
              </div>

          

              <div className="space-y-2 sm:col-span-2">
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Bio
                </label>
                <textarea
                  name="bio"
                  defaultValue={userData.bio}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:outline-none transition-all resize-none"
                  placeholder="Tell us about yourself"
                  rows="4"
                ></textarea>
              </div>

             
            </div>

            {/* Submit Button */}
            <div className="flex flex-col sm:flex-row gap-4">
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={isUpdating}
                className={`flex-1 py-3 rounded-lg text-white shadow-md ${
                  isUpdating
                    ? "bg-gray-400 dark:bg-gray-600 cursor-not-allowed"
                    : "bg-indigo-500 dark:bg-indigo-600 hover:bg-indigo-600 dark:hover:bg-indigo-700"
                }`}
              >
                {isUpdating ? "Updating..." : "Update Profile"}
              </motion.button>
              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/profile")}
                className="flex-1 py-3 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 shadow-md"
              >
                Cancel
              </motion.button>
            </div>

            {/* Feedback */}
            {success && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 flex items-center justify-center text-green-600 dark:text-green-400"
              >
                <div className="w-6 h-6 bg-green-500 dark:bg-green-600 rounded-full animate-pulse mr-2"></div>
                <span>Profile updated successfully! Redirecting...</span>
              </motion.div>
            )}
            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 flex items-center justify-center text-red-600 dark:text-red-400"
              >
                <span>{error}</span>
              </motion.div>
            )}
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default UpdateProfile;