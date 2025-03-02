import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import SyllabusUploadForm from '../index';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('SyllabusUploadForm', () => {
  const mockOnSubmit = jest.fn();
  const mockOnReset = jest.fn();

  const renderSyllabusUploadForm = (props = {}) => {
    return render(
      <BrowserRouter>
        <SyllabusUploadForm
          onSubmit={mockOnSubmit}
          onReset={mockOnReset}
          loading={false}
          error={undefined}
          uploadedData={null}
          {...props}
        />
      </BrowserRouter>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the form with all required fields', () => {
    renderSyllabusUploadForm();

    expect(screen.getByText('Upload Your Syllabus')).toBeInTheDocument();
    expect(screen.getByText('Course Name')).toBeInTheDocument();
    expect(screen.getByText('Start Date')).toBeInTheDocument();
    expect(screen.getByText('End Date')).toBeInTheDocument();
    expect(screen.getByText('Upload a file')).toBeInTheDocument();
  });

  it('handles file upload correctly', () => {
    renderSyllabusUploadForm();

    const file = new File(['test content'], 'test.pdf', { type: 'application/pdf' });
    const fileInput = screen.getByLabelText('Upload a file');

    fireEvent.change(fileInput, { target: { files: [file] } });

    expect(screen.getByText('Selected file: test.pdf')).toBeInTheDocument();
  });

  it('shows error for invalid file type', () => {
    renderSyllabusUploadForm();

    const file = new File(['test content'], 'test.txt', { type: 'text/plain' });
    const fileInput = screen.getByLabelText('Upload a file');

    fireEvent.change(fileInput, { target: { files: [file] } });

    expect(screen.getByText('Invalid file type. Only PDF documents are allowed.')).toBeInTheDocument();
  });

  it('shows error for file size exceeding limit', () => {
    renderSyllabusUploadForm();

    const largeFile = new File(['x'.repeat(11 * 1024 * 1024)], 'large.pdf', { type: 'application/pdf' });
    const fileInput = screen.getByLabelText('Upload a file');

    fireEvent.change(fileInput, { target: { files: [largeFile] } });

    expect(screen.getByText('File size too large. Maximum size is 10MB.')).toBeInTheDocument();
  });

  it('handles form submission with valid data', async () => {
    renderSyllabusUploadForm();

    const file = new File(['test content'], 'test.pdf', { type: 'application/pdf' });
    const fileInput = screen.getByLabelText('Upload a file');
    const courseNameInput = screen.getByLabelText('Course Name');
    const startDateInput = screen.getByLabelText('Start Date');
    const endDateInput = screen.getByLabelText('End Date');

    fireEvent.change(fileInput, { target: { files: [file] } });
    fireEvent.change(courseNameInput, { target: { value: 'Test Course' } });
    fireEvent.change(startDateInput, { target: { value: '2024-01-01' } });
    fireEvent.change(endDateInput, { target: { value: '2024-12-31' } });

    const submitButton = screen.getByText('Upload Syllabus');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        {
          courseName: 'Test Course',
          startDate: '2024-01-01',
          endDate: '2024-12-31'
        },
        file
      );
    });
  });

  it('shows loading state when uploading', () => {
    renderSyllabusUploadForm({ loading: true });

    expect(screen.getByText('Uploading...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /uploading/i })).toBeDisabled();
  });

  it('shows server error when provided', () => {
    const errorMessage = 'Server error occurred';
    renderSyllabusUploadForm({ error: errorMessage });

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('navigates to courses page when upload is successful', () => {
    renderSyllabusUploadForm({ uploadedData: { id: '1' } });

    expect(mockNavigate).toHaveBeenCalledWith('/courses');
  });

  it('calls onReset when component unmounts', () => {
    const { unmount } = renderSyllabusUploadForm();
    unmount();

    expect(mockOnReset).toHaveBeenCalled();
  });

  it('handles drag and drop file upload', async () => {
    renderSyllabusUploadForm();

    const dropZone = screen.getByText(/drag and drop/i).closest('div');
    const file = new File(['test content'], 'test.pdf', { type: 'application/pdf' });

    if (dropZone) {
      fireEvent.dragEnter(dropZone);
      expect(dropZone).toHaveClass('border-blue-500');

      const dataTransfer = {
        files: [file],
      };

      fireEvent.drop(dropZone, { dataTransfer });
      expect(screen.getByText('Selected file: test.pdf')).toBeInTheDocument();
    }
  });

  it('validates form data before submission', async () => {
    renderSyllabusUploadForm();

    const file = new File(['test content'], 'test.pdf', { type: 'application/pdf' });
    const fileInput = screen.getByLabelText('Upload a file');
    const submitButton = screen.getByText('Upload Syllabus');

    fireEvent.change(fileInput, { target: { files: [file] } });
    fireEvent.click(submitButton);

    expect(screen.getByText('Please fill in all required fields')).toBeInTheDocument();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });
}); 