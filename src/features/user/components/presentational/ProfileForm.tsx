"use client";

/**
 * User Profile Form component
 * Allows users to update their profile information
 */

import { useState } from "react";
import Button from "@/shared/components/ui/Button";
import { UserResponseDTO } from "@/core/application/dto/auth-dto";

interface ProfileFormProps {
  user: UserResponseDTO;
  onUpdate: (data: Partial<UserResponseDTO>) => Promise<void>;
}

export default function ProfileForm({ user, onUpdate }: ProfileFormProps) {
  const [name, setName] = useState(user.name || "");
  const [bio, setBio] = useState(user.bio || "");
  const [image, setImage] = useState(user.image || "");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      await onUpdate({ name, bio, image });
      setSuccess("Profile updated successfully");
    } catch (err: any) {
      setError(err.message || "An error occurred while updating your profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-3 rounded-md">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 p-3 rounded-md">
          {success}
        </div>
      )}

      <div>
        <label htmlFor="name" className="block mb-1 text-sm font-medium">
          Name
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md"
        />
      </div>

      <div>
        <label htmlFor="bio" className="block mb-1 text-sm font-medium">
          Bio
        </label>
        <textarea
          id="bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md"
        />
      </div>

      <div>
        <label htmlFor="image" className="block mb-1 text-sm font-medium">
          Profile Image URL
        </label>
        <input
          type="url"
          id="image"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md"
          placeholder="https://example.com/your-image.jpg"
        />
        {image && (
          <div className="mt-2">
            <img
              src={image}
              alt="Profile preview"
              className="w-16 h-16 object-cover rounded-full"
              onError={(e) => {
                e.currentTarget.src = "https://via.placeholder.com/150?text=Error";
              }}
            />
          </div>
        )}
      </div>

      <Button
        type="submit"
        isLoading={isLoading}
        disabled={isLoading}
        className="w-full"
      >
        Save Changes
      </Button>
    </form>
  );
}