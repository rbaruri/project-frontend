import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import LearningPath from '..';

const mockStore = configureStore([]);
const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('LearningPath', () => {
  const renderComponent = (initialState: any) => {
    const store = mockStore(initialState);
    return render(
      <Provider store={store}>
        <BrowserRouter>
          <LearningPath />
        </BrowserRouter>
      </Provider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should show loading state', () => {
    renderComponent({
      learningPath: { loading: true, error: null, data: null }
    });
    expect(screen.getByTestId('loading-state')).toBeInTheDocument();
  });

  it('should show error state', () => {
    const error = 'Test error';
    renderComponent({
      learningPath: { loading: false, error, data: null }
    });
    expect(screen.getByText(`Error loading learning path: ${error}`)).toBeInTheDocument();
  });

  it('should show empty state when no learning path exists', () => {
    renderComponent({
      learningPath: { loading: false, error: null, data: null }
    });
    expect(screen.getByText('No learning path found')).toBeInTheDocument();
  });

  it('should render learning path content and handle module click', () => {
    const mockLearningPath = {
      modules: [
        { id: '1', title: 'Module 1', description: 'Description 1' }
      ],
      progress: 50,
      courseName: 'Test Course'
    };

    renderComponent({
      learningPath: { loading: false, error: null, data: mockLearningPath }
    });

    const moduleElement = screen.getByText('Module 1');
    fireEvent.click(moduleElement);

    expect(mockNavigate).toHaveBeenCalledWith('/module-detail/1');
  });
}); 