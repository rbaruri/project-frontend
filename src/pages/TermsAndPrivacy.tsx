import React from 'react';
import { Link } from 'react-router-dom';

const TermsAndPrivacy: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
        <div className="mb-8">
          <Link 
            to="/authentication/signup" 
            className="inline-flex items-center text-indigo-600 hover:text-indigo-800"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Sign Up
          </Link>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms and Conditions & Privacy Policy</h1>
        
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Terms and Conditions</h2>
          <div className="space-y-4 text-gray-600">
            <p>Welcome to NerdNest. By accessing and using our platform, you agree to these terms and conditions.</p>
            
            <h3 className="text-xl font-medium text-gray-700 mt-6">1. Account Registration</h3>
            <p>Users must provide accurate and complete information when creating an account. You are responsible for maintaining the confidentiality of your account credentials.</p>
            
            <h3 className="text-xl font-medium text-gray-700 mt-6">2. Platform Usage</h3>
            <p>Our platform is designed for educational purposes. Users agree to use the platform responsibly and not engage in any activities that may disrupt the service or other users' experience.</p>
            
            <h3 className="text-xl font-medium text-gray-700 mt-6">3. Content</h3>
            <p>Users retain ownership of their content but grant us a license to use, store, and share the content as necessary to provide our services.</p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Privacy Policy</h2>
          <div className="space-y-4 text-gray-600">
            <p>Your privacy is important to us. This policy outlines how we collect, use, and protect your personal information.</p>
            
            <h3 className="text-xl font-medium text-gray-700 mt-6">1. Information Collection</h3>
            <p>We collect information you provide directly to us, including but not limited to your name, email address, and learning preferences.</p>
            
            <h3 className="text-xl font-medium text-gray-700 mt-6">2. Data Usage</h3>
            <p>We use your information to provide and improve our services, personalize your experience, and communicate with you about your account and updates.</p>
            
            <h3 className="text-xl font-medium text-gray-700 mt-6">3. Data Protection</h3>
            <p>We implement appropriate security measures to protect your personal information and prevent unauthorized access or disclosure.</p>
            
            <h3 className="text-xl font-medium text-gray-700 mt-6">4. Third-Party Services</h3>
            <p>We may use third-party services to help us operate our platform. These services have access to your information only to perform specific tasks on our behalf.</p>
          </div>
        </section>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsAndPrivacy; 