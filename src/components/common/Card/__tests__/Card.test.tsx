import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom'
import Card from '@/components/common/Card/index';

describe('Card', () => {
  it('renders children correctly', () => {
    render(
      <Card>
        <div>Test Content</div>
      </Card>
    );
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <Card className="custom-class">
        <div>Content</div>
      </Card>
    );
    const cardElement = container.firstChild as HTMLElement;
    expect(cardElement).toHaveClass('custom-class');
    expect(cardElement).toHaveClass('bg-white', 'shadow-md', 'rounded-lg');
  });

  it('handles onClick event', () => {
    const handleClick = jest.fn();
    render(
      <Card onClick={handleClick}>
        <div>Clickable Content</div>
      </Card>
    );
    fireEvent.click(screen.getByText('Clickable Content'));
    expect(handleClick).toHaveBeenCalled();
  });

  it('renders without optional props', () => {
    const { container } = render(
      <Card>
        <div>Basic Card</div>
      </Card>
    );
    const cardElement = container.firstChild as HTMLElement;
    expect(cardElement).toHaveClass('bg-white', 'shadow-md', 'rounded-lg');
    expect(cardElement).not.toHaveAttribute('onClick');
  });
}); 