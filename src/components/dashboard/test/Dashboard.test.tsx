import React from 'react';
import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import '@testing-library/jest-dom';
import Dashboard from '../index';
import { GET_COURSES_WITH_LEARNING_PATHS } from '@/graphql/queries/courses';

const mockCourses = [
  {
    id: '1',
    name: 'Course 1',
    modules: [
      { id: '1', title: 'Module 1', status: 'completed' },
      { id: '2', title: 'Module 2', status: 'in_progress' },
      { id: '3', title: 'Module 3', status: 'not_started' },
    ],
  },
  {
    id: '2',
    name: 'Course 2',
    modules: [
      { id: '4', title: 'Module 4', status: 'completed' },
      { id: '5', title: 'Module 5', status: 'completed' },
    ],
  },
];

const mocks = [
  {
    request: {
      query: GET_COURSES_WITH_LEARNING_PATHS,
      variables: { userId: 1 },
    },
    result: {
      data: {
        courses: mockCourses,
      },
    },
  },
];

describe('Dashboard', () => {
  const defaultProps = {
    firstName: 'John',
    email: 'john@example.com',
    userId: '1',
    onLogout: jest.fn(),
  };

  it('renders welcome message with user name', () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <Dashboard {...defaultProps} />
      </MockedProvider>
    );

    const currentHour = new Date().getHours();
    const greeting = currentHour < 12 ? 'Good Morning' : 'Good Evening';
    expect(screen.getByText(new RegExp(`${greeting}.*JOHN!`))).toBeInTheDocument();
  });

  it('shows loading state', () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <Dashboard {...defaultProps} />
      </MockedProvider>
    );

    expect(screen.getByText('Loading your progress...')).toBeInTheDocument();
  });

  it('displays error message when query fails', async () => {
    const errorMock = [
      {
        request: {
          query: GET_COURSES_WITH_LEARNING_PATHS,
          variables: { userId: 1 },
        },
        error: new Error('An error occurred'),
      },
    ];

    render(
      <MockedProvider mocks={errorMock} addTypename={false}>
        <Dashboard {...defaultProps} />
      </MockedProvider>
    );

    const errorMessage = await screen.findByText('Error loading data. Please try again later.');
    expect(errorMessage).toBeInTheDocument();
  });

  it('displays course statistics when data is loaded', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <Dashboard {...defaultProps} />
      </MockedProvider>
    );

    // Wait for data to load
    const coursesInProgress = await screen.findByText('1');
    expect(coursesInProgress).toBeInTheDocument();

    // Verify completed courses count
    const completedCourses = await screen.findByText('1');
    expect(completedCourses).toBeInTheDocument();

    // Verify progress text is present
    expect(screen.getByText(/Overall Progress/)).toBeInTheDocument();
  });
}); 