import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SignUpFormData, SignUpFormProps, ValidationState } from '@/components/auth/SignUpForm/types';
import { 
  validateEmail, 
  validatePassword, 
  validateName, 
  validatePasswordMatch,
  getPasswordRequirements,
  getNameRequirements,
  getEmailRequirements 
} from './helper';

const SignUpForm: React.FC<SignUpFormProps> = ({ onSubmit, loading, error }) => {
  const [formData, setFormData] = useState<SignUpFormData & { confirmPassword: string }>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [validationError, setValidationError] = useState<ValidationState['error']>(null);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setAgreedToTerms(checked);
      setValidationError(null);
      return;
    }
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setValidationError(null);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouchedFields((prev) => ({
      ...prev,
      [name]: true,
    }));
  };

  const getFieldError = (fieldName: string): string | null => {
    if (!touchedFields[fieldName]) return null;

    switch (fieldName) {
      case 'firstName':
      case 'lastName':
        return !validateName(formData[fieldName]) ? getNameRequirements() : null;
      case 'email':
        return !validateEmail(formData.email) ? getEmailRequirements() : null;
      case 'password':
        return !validatePassword(formData.password) ? getPasswordRequirements() : null;
      case 'confirmPassword':
        return !validatePasswordMatch(formData.password, formData.confirmPassword) 
          ? "Passwords must match" : null;
      default:
        return null;
    }
  };

  const validateForm = () => {
    if (!validateName(formData.firstName)) {
      setValidationError('First name is required and must be at least 2 characters');
      return false;
    }
    if (!validateName(formData.lastName)) {
      setValidationError('Last name is required and must be at least 2 characters');
      return false;
    }
    if (!validateEmail(formData.email)) {
      setValidationError('Please enter a valid email address');
      return false;
    }
    if (!validatePassword(formData.password)) {
      setValidationError(getPasswordRequirements());
      return false;
    }
    if (!validatePasswordMatch(formData.password, formData.confirmPassword)) {
      setValidationError('Passwords do not match');
      return false;
    }
    if (!agreedToTerms) {
      setValidationError('Please agree to the Terms and Conditions');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // Mark all fields as touched on submit
    const allFields = ['firstName', 'lastName', 'email', 'password', 'confirmPassword'];
    setTouchedFields(allFields.reduce((acc, field) => ({ ...acc, [field]: true }), {}));

    if (!validateForm()) {
      return;
    }

    const signupData: SignUpFormData = {
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      email: formData.email.trim(),
      password: formData.password,
    };

    onSubmit(signupData);
  };

  const renderFieldLabel = (fieldName: string, label: string) => (
    <label htmlFor={fieldName} className="block text-sm font-medium text-gray-700 mb-1">
      {label} <span className="text-red-500">*</span>
    </label>
  );

  const renderFieldError = (fieldName: string) => {
    const error = getFieldError(fieldName);
    return error ? (
      <p className="mt-1 text-sm text-red-600">{error}</p>
    ) : null;
  };

  return (
    <div className="w-full max-w-md px-4">
      <div className="bg-white shadow-xl rounded-lg p-8 space-y-4 border border-gray-100">
        <h2 className="text-center text-2xl font-extrabold text-gray-900">
          Create your account
        </h2>
        <p className="mt-1 text-center text-sm text-gray-600">
          Join us to start your journey
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                {renderFieldLabel('firstName', 'First Name')}
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter your first name"
                  value={formData.firstName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {renderFieldError('firstName')}
              </div>

              <div>
                {renderFieldLabel('lastName', 'Last Name')}
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter your last name"
                  value={formData.lastName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {renderFieldError('lastName')}
              </div>
            </div>

            <div>
              {renderFieldLabel('email', 'Email Address')}
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter your email address"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {renderFieldError('email')}
            </div>

            <div>
              {renderFieldLabel('password', 'Password')}
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm pr-10"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  )}
                </button>
              </div>
              {renderFieldError('password')}
            </div>

            <div>
              {renderFieldLabel('confirmPassword', 'Confirm Password')}
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm pr-10"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  )}
                </button>
              </div>
              {renderFieldError('confirmPassword')}
            </div>
          </div>

          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                checked={agreedToTerms}
                onChange={handleChange}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="terms" className="text-gray-600">
                By creating an account, you agree to our{' '}
                <Link to="/terms-and-privacy" className="text-indigo-600 hover:text-indigo-500">
                  Terms and Conditions
                </Link>{' '}
                and{' '}
                <Link to="/terms-and-privacy" className="text-indigo-600 hover:text-indigo-500">
                  Privacy Policy
                </Link>
              </label>
            </div>
          </div>

          {(validationError || error) && (
            <div className="text-red-500 text-sm text-center">
              {validationError || error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Signing up...
                </span>
              ) : (
                "Sign up"
              )}
            </button>
          </div>
        </form>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              to="/authentication/login"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpForm; 