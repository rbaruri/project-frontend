// import React from 'react';
// import { render, screen, fireEvent } from '@testing-library/react';
// import { BrowserRouter } from 'react-router-dom';
// import { AuthProvider } from '@/context/AuthContext';
// import Navbar from '@/components/common/Navbar/index';
// import '@testing-library/jest-dom'

// // Mock the auth context
// jest.mock('@/context/AuthContext', () => ({
//   useAuth: () => ({
//     logout: jest.fn(),
//     user: { first_name: 'John' },
//     isAuthenticated: true
//   }),
//   AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>
// }));

// const renderNavbar = () => {
//   return render(
//     <BrowserRouter>
//       <AuthProvider>
//         <Navbar />
//       </AuthProvider>
//     </BrowserRouter>
//   );
// };

// describe('Navbar', () => {
//   it('renders the logo', () => {
//     renderNavbar();
//     expect(screen.getByText('NerdNest')).toBeInTheDocument();
//   });

//   it('renders navigation links', () => {
//     renderNavbar();
//     expect(screen.getByText('Home')).toBeInTheDocument();
//     expect(screen.getByText('Courses')).toBeInTheDocument();
//     expect(screen.getByText('Syllabus Upload')).toBeInTheDocument();
//   });

//   it('shows user name when authenticated', () => {
//     renderNavbar();
//     expect(screen.getByText('John')).toBeInTheDocument();
//   });

//   it('toggles mobile menu when hamburger is clicked', () => {
//     renderNavbar();
//     const menuButton = screen.getByLabelText('Toggle menu');
//     fireEvent.click(menuButton);
    
//     // Check if menu is visible
//     const mobileMenu = document.querySelector('[class*="translate-x-0"]');
//     expect(mobileMenu).toBeInTheDocument();
    
//     // Click again to close
//     fireEvent.click(menuButton);
//     const closedMenu = document.querySelector('[class*="translate-x-full"]');
//     expect(closedMenu).toBeInTheDocument();
//   });

//   it('prevents body scroll when mobile menu is open', () => {
//     renderNavbar();
//     const menuButton = screen.getByLabelText('Toggle menu');
    
//     fireEvent.click(menuButton);
//     expect(document.body.style.overflow).toBe('hidden');
    
//     fireEvent.click(menuButton);
//     expect(document.body.style.overflow).toBe('auto');
//   });
// }); 