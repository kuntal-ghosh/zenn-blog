"use client";

/**
 * Container component for user profile
 * Handles data fetching and updates for user profile
 */

import { useState, useEffect } from "react";
import { UserResponseDTO } from "@/core/application/dto/auth-dto";
import ProfileForm from "../presentational/ProfileForm";
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/Card";
import { useRouter } from "next/navigation";

export default function ProfileContainer() {
  const [user, setUser] = useState<UserResponseDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    // Fetch user profile data
    const fetchProfile = async () => {
      try {
        const response = await fetch("/api/user/profile");
        
        if (response.status === 401) {
          // Not authenticated, redirect to login
          router.push("/login");
          return;
        }
        
        if (!response.ok) {
          throw new Error("Failed to fetch profile");
        }
        
        const data = await response.json();
        setUser(data);
      } catch (err: any) {
        setError(err.message || "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProfile();
  }, [router]);

  const handleUpdateProfile = async (data: Partial<UserResponseDTO>) => {
    try {
      const response = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update profile");
      }
      
      const updatedUser = await response.json();
      setUser(updatedUser);
      
      // Refresh to ensure all components show the updated data
      router.refresh();
    } catch (err: any) {
      throw err;
    }
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading profile...</div>;
  }

  if (error || !user) {
    return (
      <div className="max-w-md mx-auto p-4">
        <Card>
          <CardContent>
            <div className="text-red-500">
              {error || "Failed to load profile. Please try again."}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Your Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <ProfileForm user={user} onUpdate={handleUpdateProfile} />
        </CardContent>
      </Card>
    </div>
  );
}