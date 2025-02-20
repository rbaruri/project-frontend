import React from 'react';

interface SignUpFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface SignUpFormProps {
  formData: SignUpFormData;
  error: string;
  onSubmit: (e: React.FormEvent) => void;
  onChange: (field: keyof SignUpFormData, value: string) => void;
}

const SignUpForm: React.FC<SignUpFormProps> = ({
  formData,
  error,
  onSubmit,
  onChange,
}) => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-center text-2xl font-semibold text-gray-700">Sign Up</h2>
        {error && (
          <div className="mb-4 rounded bg-red-100 p-2 text-sm text-red-600">
            {error}
          </div>
        )}
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">First Name</label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => onChange('firstName', e.target.value)}
              required
              className="w-full rounded border border-gray-300 p-2 text-gray-700 focus:border-blue-500 focus:outline-none focus:ring"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Last Name</label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => onChange('lastName', e.target.value)}
              required
              className="w-full rounded border border-gray-300 p-2 text-gray-700 focus:border-blue-500 focus:outline-none focus:ring"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => onChange('email', e.target.value)}
              required
              className="w-full rounded border border-gray-300 p-2 text-gray-700 focus:border-blue-500 focus:outline-none focus:ring"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => onChange('password', e.target.value)}
              required
              className="w-full rounded border border-gray-300 p-2 text-gray-700 focus:border-blue-500 focus:outline-none focus:ring"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Confirm Password</label>
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => onChange('confirmPassword', e.target.value)}
              required
              className="w-full rounded border border-gray-300 p-2 text-gray-700 focus:border-blue-500 focus:outline-none focus:ring"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUpForm; 