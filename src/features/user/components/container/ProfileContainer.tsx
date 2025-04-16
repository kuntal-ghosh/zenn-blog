import React from 'react';
import { useUser } from '../../hooks/useUser';
import ProfileForm from '../presentational/ProfileForm';

const ProfileContainer: React.FC = () => {
    const { user, loading, error } = useUser();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error loading user profile.</div>;
    }

    return (
        <div>
            <h1>User Profile</h1>
            {user ? <ProfileForm user={user} /> : <div>No user data available.</div>}
        </div>
    );
};

export default ProfileContainer;