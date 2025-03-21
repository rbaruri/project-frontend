import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import CourseList from '../index';
import { Course } from '../types';

const mockCourses: Course[] = [
  {
    id: '1',
    title: 'React Fundamentals',
    description: 'Learn the basics of React',
    progress: 75,
    totalModules: 10,
    completedModules: 7,
    imageUrl: 'https://example.com/react.jpg'
  },
  {
    id: '2',
    title: 'TypeScript Basics',
    description: 'Introduction to TypeScript',
    progress: 30,
    totalModules: 8,
    completedModules: 2,
  }
];

const renderCourseList = (props: {
  courses: Course[];
  isLoading?: boolean;
  error?: string | null;
}) => {
  return render(
    <BrowserRouter>
      <CourseList
        courses={props.courses}
        isLoading={props.isLoading || false}
        error={props.error || null}
      />
    </BrowserRouter>
  );
};

describe('CourseList', () => {
  it('renders loading state correctly', () => {
    renderCourseList({ courses: [], isLoading: true });
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('renders error state correctly', () => {
    const errorMessage = 'Failed to load courses';
    renderCourseList({ courses: [], error: errorMessage });
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('renders empty state correctly', () => {
    renderCourseList({ courses: [] });
    expect(screen.getByText('No Courses Found')).toBeInTheDocument();
    expect(screen.getByText('No learning paths have been generated yet.')).toBeInTheDocument();
    expect(screen.getByText('Upload a Syllabus')).toBeInTheDocument();
  });

  it('renders course list correctly', () => {
    renderCourseList({ courses: mockCourses });

    // Check if both courses are rendered
    expect(screen.getByText('React Fundamentals')).toBeInTheDocument();
    expect(screen.getByText('TypeScript Basics')).toBeInTheDocument();

    // Check progress information
    expect(screen.getByText('75%')).toBeInTheDocument();
    expect(screen.getByText('30%')).toBeInTheDocument();

    // Check module completion information
    expect(screen.getByText('7 of 10 modules completed')).toBeInTheDocument();
    expect(screen.getByText('2 of 8 modules completed')).toBeInTheDocument();

    // Check if View Course links are present
    const viewCourseLinks = screen.getAllByText('View Course');
    expect(viewCourseLinks).toHaveLength(2);
    expect(viewCourseLinks[0]).toHaveAttribute('href', '/courses/1');
    expect(viewCourseLinks[1]).toHaveAttribute('href', '/courses/2');
  });

  it('renders course image when imageUrl is provided', () => {
    renderCourseList({ courses: mockCourses });
    const courseImage = screen.getByAltText('React Fundamentals');
    expect(courseImage).toBeInTheDocument();
    expect(courseImage).toHaveAttribute('src', 'https://example.com/react.jpg');
  });

  it('does not render image when imageUrl is not provided', () => {
    renderCourseList({ courses: mockCourses });
    expect(screen.queryByAltText('TypeScript Basics')).not.toBeInTheDocument();
  });
}); 