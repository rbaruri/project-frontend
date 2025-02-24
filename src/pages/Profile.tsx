import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useAuth } from '../context/AuthContext';
import { GET_USER_PROFILE, UPDATE_USER_PROFILE } from '../graphql/queries/user';
import { Navigate } from 'react-router-dom';

interface UserProfile {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  created_at: string;
}

const ProfilePage: React.FC = () => {
  const { user, login } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { loading, data } = useQuery(GET_USER_PROFILE, {
    variables: { userId: parseInt(user?.userId || '0', 10) },
    skip: !user?.userId
  });

  const [updateProfile] = useMutation(UPDATE_USER_PROFILE, {
    onCompleted: (data) => {
      // Update the auth context with new user data
      const updatedUser = {
        ...user!,
        email: data.update_users_by_pk.email,
        firstName: data.update_users_by_pk.first_name,
        lastName: data.update_users_by_pk.last_name,
      };
      login({ user: updatedUser });
      setIsEditing(false);
      setError(null);
    },
    onError: (error) => {
      setError(error.message);
    }
  });

  const [formData, setFormData] = useState<{
    firstName: string;
    lastName: string;
    email: string;
  }>({
    firstName: '',
    lastName: '',
    email: ''
  });

  React.useEffect(() => {
    if (data?.users_by_pk) {
      setFormData({
        firstName: data.users_by_pk.first_name,
        lastName: data.users_by_pk.last_name,
        email: data.users_by_pk.email
      });
    }
  }, [data]);

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile({
        variables: {
          userId: parseInt(user.userId, 10),
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email
        }
      });
    } catch (err) {
      console.error('Error updating profile:', err);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Profile Settings</h1>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Edit Profile
            </button>
          )}
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isEditing ? 'bg-white' : 'bg-gray-100'
                }`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isEditing ? 'bg-white' : 'bg-gray-100'
                }`}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              disabled={!isEditing}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isEditing ? 'bg-white' : 'bg-gray-100'
              }`}
            />
          </div>

          {isEditing && (
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setError(null);
                  // Reset form data to original values
                  if (data?.users_by_pk) {
                    setFormData({
                      firstName: data.users_by_pk.first_name,
                      lastName: data.users_by_pk.last_name,
                      email: data.users_by_pk.email
                    });
                  }
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Save Changes
              </button>
            </div>
          )}
        </form>

        <div className="mt-8 pt-6 border-t">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Account Information</h2>
          <div className="text-gray-600">
            <p>Member since: {new Date(data?.users_by_pk?.created_at).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage; 