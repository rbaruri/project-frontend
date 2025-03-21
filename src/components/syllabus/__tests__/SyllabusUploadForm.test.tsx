import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';

// Mock the PDF import
jest.mock('@/assets/sample-syllabus.pdf', () => 'mocked-pdf-path');

import SyllabusUploadForm from '@/components/syllabus/index';

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

  it('calls onReset when component unmounts', () => {
    const { unmount } = renderSyllabusUploadForm();
    unmount();

    expect(mockOnReset).toHaveBeenCalled();
  });
}); 