import React from 'react';
import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import CoursesContainer from '../index';
import { GET_COURSES_WITH_LEARNING_PATHS } from '@/graphql/queries/courses';
import { AuthProvider } from '@/context/AuthContext';

const mockUser = {
  userId: '1',
  email: 'test@example.com',
  firstName: 'Test',
  lastName: 'User'
};

const mockCourses = [
  {
    id: '1',
    name: 'React Course',
    start_date: '2024-01-01',
    end_date: '2024-03-01',
    learning_paths: [
      {
        id: '1',
        generated_path: {
          topics: [
            { estimated_hours: 10 },
            { estimated_hours: 15 }
          ]
        },
        created_at: '2024-01-01'
      }
    ],
    modules: [
      { id: '1', title: 'Module 1', status: 'completed' },
      { id: '2', title: 'Module 2', status: 'in_progress' }
    ]
  }
];

const mocks = [
  {
    request: {
      query: GET_COURSES_WITH_LEARNING_PATHS,
      variables: { userId: 1 }
    },
    result: {
      data: {
        courses: mockCourses
      }
    }
  }
];

const renderCoursesContainer = () => {
  return render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <AuthProvider initialUser={mockUser}>
        <BrowserRouter>
          <CoursesContainer />
        </BrowserRouter>
      </AuthProvider>
    </MockedProvider>
  );
};

describe('CoursesContainer', () => {
  it('shows loading state initially', () => {
    renderCoursesContainer();
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('renders courses when data is loaded', async () => {
    renderCoursesContainer();
    
    // Wait for loading to finish
    await screen.findByText('React Course');
    
    // Check if course card is rendered with correct information
    expect(screen.getByText('React Course')).toBeInTheDocument();
    expect(screen.getByText('8 weeks • 3 hours/week')).toBeInTheDocument();
    expect(screen.getByText('Total: 25 hours')).toBeInTheDocument();
  });

  it('shows error state when query fails', async () => {
    const errorMock = [
      {
        request: {
          query: GET_COURSES_WITH_LEARNING_PATHS,
          variables: { userId: 1 }
        },
        error: new Error('Failed to load courses')
      }
    ];

    render(
      <MockedProvider mocks={errorMock} addTypename={false}>
        <AuthProvider initialUser={mockUser}>
          <BrowserRouter>
            <CoursesContainer />
          </BrowserRouter>
        </AuthProvider>
      </MockedProvider>
    );

    // Wait for error state
    const errorMessage = await screen.findByText('Failed to load courses');
    expect(errorMessage).toBeInTheDocument();
    expect(screen.getByText('Try Again')).toBeInTheDocument();
  });
}); 