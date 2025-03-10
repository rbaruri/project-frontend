import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AuthModal from '@/components/common/AuthModal/index';
import '@testing-library/jest-dom'


// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

describe('AuthModal', () => {
  const mockProps = {
    isOpen: true,
    onClose: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderModal = (props = mockProps) => {
    return render(
      <BrowserRouter>
        <AuthModal {...props} />
      </BrowserRouter>
    );
  };

  it('renders modal when isOpen is true', () => {
    renderModal();
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Authentication Required')).toBeInTheDocument();
  });

  it('does not render modal content when isOpen is false', () => {
    renderModal({ ...mockProps, isOpen: false });
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveClass('opacity-0', 'pointer-events-none');
  });

  it('navigates to signup page and calls onClose when signup button is clicked', () => {
    renderModal();
    fireEvent.click(screen.getByText('Sign Up'));
    expect(mockNavigate).toHaveBeenCalledWith('/authentication/signup');
    expect(mockProps.onClose).toHaveBeenCalled();
  });

  it('navigates to login page and calls onClose when signin button is clicked', () => {
    renderModal();
    fireEvent.click(screen.getByText('Sign In'));
    expect(mockNavigate).toHaveBeenCalledWith('/authentication/login');
    expect(mockProps.onClose).toHaveBeenCalled();
  });

  it('displays the correct message', () => {
    renderModal();
    expect(screen.getByText(/To upload and process your syllabus/)).toBeInTheDocument();
    expect(screen.getByText(/This helps us save your learning path/)).toBeInTheDocument();
  });

  it('has the correct accessibility attributes', () => {
    renderModal();
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-labelledby', 'modal-title');
  });
}); 