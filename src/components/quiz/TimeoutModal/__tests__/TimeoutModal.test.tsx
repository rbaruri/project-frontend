import { render, screen } from '@testing-library/react';
import TimeoutModal from '@/components/quiz/TimeoutModal';
import '@testing-library/jest-dom';

jest.mock('@headlessui/react', () => ({
  Dialog: ({ open, children }: { open: boolean; children: React.ReactNode }) =>
    open ? <div data-testid="dialog">{children}</div> : null,
  Transition: {
    Root: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    Child: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  },
}));

describe('TimeoutModal', () => {
  it('does not render the modal when isOpen is false', () => {
    render(<TimeoutModal isOpen={false} onRetake={jest.fn()} />);

    // Debugging step
    screen.debug();

    // Ensure the modal is not in the document
    expect(screen.queryByTestId('dialog')).not.toBeInTheDocument();
  });
});
