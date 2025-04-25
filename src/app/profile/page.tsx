/**
 * Profile Page
 * Uses the ProfileContainer from the user feature
 */

import { Metadata } from "next";
import ProfileContainer from "@/features/user/components/container/ProfileContainer";

export const metadata: Metadata = {
  title: "Your Profile | Blog Site",
  description: "View and edit your profile information",
};

export default function ProfilePage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Your Profile</h1>
      <ProfileContainer />
    </div>
  );
}