import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import CourseCard from '../index';
import { UPDATE_COURSE_NAME, DELETE_COURSE } from '@/graphql/queries/courses';
import { Course } from '../types';

const mockCourse: Course = {
  id: '1',
  course_name: 'Test Course',
  total_duration: {
    value: 8,
    unit: 'weeks'
  },
  total_hours: 40,
  hours_per_week: 5,
  start_date: '2024-03-01',
  end_date: '2024-04-30',
  progress: 75,
  onClick: jest.fn()
};

const mocks = [
  {
    request: {
      query: UPDATE_COURSE_NAME,
      variables: { id: '1', name: 'Updated Course' }
    },
    result: {
      data: {
        updateCourseName: {
          id: '1',
          course_name: 'Updated Course'
        }
      }
    }
  },
  {
    request: {
      query: DELETE_COURSE,
      variables: { id: '1' }
    },
    result: {
      data: {
        deleteCourse: {
          id: '1'
        }
      }
    }
  }
];

describe('CourseCard', () => {
  it('renders course details correctly', () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <CourseCard course={mockCourse} userId={1} />
      </MockedProvider>
    );

    expect(screen.getByText('Test Course')).toBeInTheDocument();
    expect(screen.getByText('75%')).toBeInTheDocument();
    expect(screen.getByText('8 weeks • 5 hours/week')).toBeInTheDocument();
    expect(screen.getByText('3/1/2024 - 4/30/2024')).toBeInTheDocument();
    expect(screen.getByText('Total: 40 hours')).toBeInTheDocument();
  });

  it('handles course name editing', () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <CourseCard course={mockCourse} userId={1} />
      </MockedProvider>
    );

    // Click edit button
    const editButton = screen.getByTitle('Edit course name');
    fireEvent.click(editButton);

    // Check if input field appears
    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue('Test Course');

    // Update input value
    fireEvent.change(input, { target: { value: 'Updated Course' } });
    expect(input).toHaveValue('Updated Course');

    // Submit form
    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);
  });

  it('handles course deletion', () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <CourseCard course={mockCourse} userId={1} />
      </MockedProvider>
    );

    // Click delete button
    const deleteButton = screen.getByTitle('Delete course');
    fireEvent.click(deleteButton);

    // Check if confirmation modal appears
    expect(screen.getByText('Delete Course')).toBeInTheDocument();
    expect(screen.getByText('Are you sure you want to delete "Test Course"? This action cannot be undone.')).toBeInTheDocument();

    // Confirm deletion
    const confirmButton = screen.getByText('Delete');
    fireEvent.click(confirmButton);
  });

  it('handles view learning path click', () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <CourseCard course={mockCourse} userId={1} />
      </MockedProvider>
    );

    const viewButton = screen.getByText('View Learning Path');
    fireEvent.click(viewButton);
    expect(mockCourse.onClick).toHaveBeenCalled();
  });

  it('prevents event propagation when editing', () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <CourseCard course={mockCourse} userId={1} />
      </MockedProvider>
    );

    // Click edit button
    const editButton = screen.getByTitle('Edit course name');
    fireEvent.click(editButton);

    // Click input field
    const input = screen.getByRole('textbox');
    const clickEvent = { stopPropagation: jest.fn() };
    fireEvent.click(input, clickEvent);

    expect(clickEvent.stopPropagation).toHaveBeenCalled();
  });
}); 