import React from 'react';
import { useForm } from '@/shared/hooks/useForm';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import { User } from '../../types';

interface ProfileFormProps {
  user: User;
  onSubmit: (data: User) => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ user, onSubmit }) => {
  const { values, handleChange, handleSubmit } = useForm<User>({
    initialValues: user,
    onSubmit: (data) => {
      onSubmit(data);
    },
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        name="name"
        label="Name"
        value={values.name}
        onChange={handleChange}
        required
      />
      <Input
        name="email"
        label="Email"
        type="email"
        value={values.email}
        onChange={handleChange}
        required
      />
      <Button type="submit">Update Profile</Button>
    </form>
  );
};

export default ProfileForm;