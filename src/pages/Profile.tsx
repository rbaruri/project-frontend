import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useAuth } from '@/context/AuthContext';
import { GET_USER_PROFILE, UPDATE_USER_PROFILE } from '@/graphql/queries/user';
import { UPDATE_PASSWORD } from '@/graphql/mutations/updatePassword';
import { Navigate } from 'react-router-dom';
import bcrypt from 'bcryptjs';
import PasswordValidation from '@/components/common/PasswordValidation';


const ProfilePage: React.FC = () => {
  const { user, login } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  const { loading, data } = useQuery(GET_USER_PROFILE, {
    variables: { userId: parseInt(user?.userId || '0', 10) },
    skip: !user?.userId
  });

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not set';
    try {
      const date = new Date(dateString);
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const [updateProfile] = useMutation(UPDATE_USER_PROFILE, {
    onCompleted: (data) => {
      const updatedUser = {
        ...user!,
        email: data.update_users_by_pk.email,
        first_name: data.update_users_by_pk.first_name,
        last_name: data.update_users_by_pk.last_name,
      };
      login(updatedUser);
      setIsEditing(false);
      setError(null);
      setHasChanges(false);
    },
    onError: (error) => {
      setError(error.message);
    }
  });

  const [updatePassword] = useMutation(UPDATE_PASSWORD, {
    onCompleted: () => {
      setIsChangingPassword(false);
      setPasswordError(null);
      setPasswordSuccess('Password updated successfully!');
      setPasswordData({
        newPassword: '',
        confirmPassword: ''
      });
    },
    onError: (error) => {
      setPasswordError(error.message);
      setPasswordSuccess(null);
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

  const [initialFormData, setInitialFormData] = useState({
    firstName: '',
    lastName: '',
    email: ''
  });

  const [passwordData, setPasswordData] = useState<{
    newPassword: string;
    confirmPassword: string;
  }>({
    newPassword: '',
    confirmPassword: ''
  });

  // Validation functions
  const isProfileFormValid = () => {
    return formData.firstName.trim() !== '' && 
           formData.lastName.trim() !== '' && 
           formData.email.trim() !== '' &&
           hasChanges;
  };

  const isPasswordFormValid = () => {
    return passwordData.newPassword.trim() !== '' && 
           passwordData.confirmPassword.trim() !== '';
  };

  const validatePassword = (password: string): boolean => {
    const hasMinLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return hasMinLength && hasUpperCase && hasNumber && hasSpecialChar;
  };

  useEffect(() => {
    if (data?.users_by_pk) {
      const newFormData = {
        firstName: data.users_by_pk.first_name,
        lastName: data.users_by_pk.last_name,
        email: data.users_by_pk.email
      };
      setFormData(newFormData);
      setInitialFormData(newFormData);
    }
  }, [data]);

  useEffect(() => {
    // Check if current form data is different from initial data
    const hasFormChanges = 
      formData.firstName !== initialFormData.firstName ||
      formData.lastName !== initialFormData.lastName ||
      formData.email !== initialFormData.email;
    
    setHasChanges(hasFormChanges);
  }, [formData, initialFormData]);

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
    
    if (!isProfileFormValid()) {
      setError("All fields are required");
      return;
    }

    try {
      await updateProfile({
        variables: {
          userId: parseInt(user.userId, 10),
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          email: formData.email.trim()
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

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);

    if (!isPasswordFormValid()) {
      setPasswordError("All password fields are required");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("New passwords don't match");
      return;
    }

    if (!validatePassword(passwordData.newPassword)) {
      setPasswordError("Password does not meet the requirements");
      return;
    }

    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(passwordData.newPassword, salt);

      await updatePassword({
        variables: {
          userId: parseInt(user?.userId || '0', 10),
          hashedPassword: hashedPassword
        }
      });
    } catch (err) {
      console.error('Error updating password:', err);
      setPasswordError('Failed to update password');
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Profile Settings</h1>
              {data?.users_by_pk?.created_at && (
                <p className="text-sm text-gray-600 mt-1">
                  Member since {formatDate(data.users_by_pk.created_at)}
                </p>
              )}
            </div>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
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
                required
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
                    setFormData(initialFormData);
                    setHasChanges(false);
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!isProfileFormValid()}
                  className={`px-4 py-2 rounded-lg text-white ${
                    isProfileFormValid()
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : 'bg-gray-400 cursor-not-allowed'
                  }`}
                >
                  Save Changes
                </button>
              </div>
            )}
          </form>

          <div className="mt-12 pt-8 border-t">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Change Password</h2>
              {!isChangingPassword && (
                <button
                  onClick={() => setIsChangingPassword(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Change Password
                </button>
              )}
            </div>

            {passwordError && (
              <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
                {passwordError}
              </div>
            )}

            {passwordSuccess && (
              <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-lg">
                {passwordSuccess}
              </div>
            )}

            {isChangingPassword && (
              <form onSubmit={handlePasswordSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <PasswordValidation password={passwordData.newPassword} />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {passwordData.confirmPassword && passwordData.newPassword !== passwordData.confirmPassword && (
                    <p className="mt-2 text-sm text-red-600">Passwords do not match</p>
                  )}
                </div>

                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsChangingPassword(false);
                      setPasswordError(null);
                      setPasswordSuccess(null);
                      setPasswordData({
                        newPassword: '',
                        confirmPassword: ''
                      });
                    }}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!isPasswordFormValid() || !validatePassword(passwordData.newPassword)}
                    className={`px-4 py-2 rounded-lg text-white ${
                      isPasswordFormValid() && validatePassword(passwordData.newPassword)
                        ? 'bg-blue-600 hover:bg-blue-700'
                        : 'bg-gray-400 cursor-not-allowed'
                    }`}
                  >
                    Update Password
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage; 