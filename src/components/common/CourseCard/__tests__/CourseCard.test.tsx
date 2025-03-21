import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import CourseCard from '@/components/common/CourseCard';
import { UPDATE_COURSE_NAME, DELETE_COURSE } from '@/graphql/queries/courses';
import { Course } from '@/components/common/CourseCard/types';
import '@testing-library/jest-dom';

const mockCourse: Course = {
  id: '1',
  course_name: 'Test Course',
  total_duration: { value: 8, unit: 'weeks' },
  total_hours: 40,
  hours_per_week: 5,
  start_date: '2024-03-01',
  end_date: '2024-04-30',
  progress: 75,
  modules: [], 
};

const mocks = [
  {
    request: { query: UPDATE_COURSE_NAME, variables: { id: '1', name: 'Updated Course' } },
    result: { data: { updateCourseName: { id: '1', course_name: 'Updated Course' } } },
  },
  {
    request: { query: DELETE_COURSE, variables: { id: '1' } },
    result: { data: { deleteCourse: { id: '1' } } },
  },
];

describe('CourseCard', () => {
  const mockOnClick = jest.fn();
  const mockOnViewModules = jest.fn();

  it('renders course details correctly', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <CourseCard 
          course={mockCourse} 
          userId={1} 
          onClick={mockOnClick}
          onViewModules={mockOnViewModules}
        />
      </MockedProvider>
    );

    // Wait for the course name to appear
    await waitFor(() => expect(screen.getByText('Test Course')).toBeInTheDocument());
    expect(screen.getByText('75%')).toBeInTheDocument();

    // Duration text
    expect(screen.getByText(/Duration: 8 weeks/i)).toBeInTheDocument();

    // Date checks
    expect(screen.getByText(/Start: 03-01-2024/i)).toBeInTheDocument();
    expect(screen.getByText(/End: 04-30-2024/i)).toBeInTheDocument();

    // Module progress
    expect(screen.getByText('0 of 0 modules completed')).toBeInTheDocument();
  });

  it('handles course name editing', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <CourseCard 
          course={mockCourse} 
          userId={1} 
          onClick={mockOnClick}
          onViewModules={mockOnViewModules}
        />
      </MockedProvider>
    );

    // Find and click the edit button (the pencil icon)
    const editButton = screen.getByRole('button', { name: '' });
    fireEvent.click(editButton);

    // Ensure input appears
    const input = await screen.findByRole('textbox');
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue('Test Course');

    // Change input value
    fireEvent.change(input, { target: { value: 'Updated Course' } });
    expect(input).toHaveValue('Updated Course');

    // Click Save
    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);
  });

  it('handles course deletion', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <CourseCard 
          course={mockCourse} 
          userId={1} 
          onClick={mockOnClick}
          onViewModules={mockOnViewModules}
        />
      </MockedProvider>
    );

    // Find and click the delete button
    const deleteButton = screen.getByRole('button', { name: '' });
    fireEvent.click(deleteButton);

    // Ensure modal appears
    await waitFor(() => {
      expect(screen.getByText('Delete Course')).toBeInTheDocument();
      expect(screen.getByText(/Are you sure you want to delete this course/i)).toBeInTheDocument();
    });

    // Confirm deletion
    const confirmButton = screen.getByText('Delete');
    fireEvent.click(confirmButton);
  });

  it('handles view modules click', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <CourseCard 
          course={mockCourse} 
          userId={1} 
          onClick={mockOnClick}
          onViewModules={mockOnViewModules}
        />
      </MockedProvider>
    );

    const viewButton = screen.getByText('View Modules');
    fireEvent.click(viewButton);
    expect(mockOnViewModules).toHaveBeenCalled();
  });

  it('prevents event propagation when editing', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <CourseCard 
          course={mockCourse} 
          userId={1} 
          onClick={mockOnClick}
          onViewModules={mockOnViewModules}
        />
      </MockedProvider>
    );

    // Find and click the edit button
    const editButton = screen.getByRole('button', { name: '' });
    fireEvent.click(editButton);

    const input = await screen.findByRole('textbox');
    const clickEvent = { stopPropagation: jest.fn() };
    fireEvent.click(input, clickEvent);

    expect(clickEvent.stopPropagation).toHaveBeenCalled();
  });
});
