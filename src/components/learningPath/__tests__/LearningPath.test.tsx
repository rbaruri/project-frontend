import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import '@testing-library/jest-dom';
import LearningPath from '@/components/learningPath/index';

const mockStore = configureStore([]);
const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('LearningPath', () => {
  const renderComponent = (initialState: any) => {
    const store = mockStore({
      learningPath: initialState.learningPath,
      // Add other required state slices that the selectors might need
      modules: {
        data: initialState.learningPath.data?.modules || [],
        loading: initialState.learningPath.loading,
        error: initialState.learningPath.error
      }
    });
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
    expect(screen.getByTestId('loading-skeleton')).toBeInTheDocument();
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
    expect(screen.getByText('Get started by uploading a syllabus or enrolling in a course.')).toBeInTheDocument();
  });
}); 