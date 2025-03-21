import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import ModuleList from '..';
import { GET_MODULES_BY_COURSE, UPDATE_MODULE_STATUS } from '@/graphql/queries/modules';
import '@testing-library/jest-dom';

const mockStore = configureStore([]);
const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('ModuleList', () => {
  const mockModules = [
    {
      id: '1',
      course_id: 'course1',
      title: 'Module 1',
      status: 'not_started',
      created_at: '2024-01-01',
      resources: [
        {
          id: 'r1',
          title: 'Resource 1',
          url: 'http://example.com',
          created_at: '2024-01-01',
        },
      ],
      quizzes: [
        {
          id: 'q1',
          cutoff_score: 70,
          status: 'not_attempted',
          created_at: '2024-01-01',
        },
      ],
      similar_questions: [
        {
          id: 'sq1',
          module_id: '1',
          question: 'Practice Question 1',
          created_at: '2024-01-01',
        },
      ],
    },
  ];

  const mocks = [
    {
      request: {
        query: GET_MODULES_BY_COURSE,
        variables: { courseId: 'course1' },
      },
      result: {
        data: {
          modules: mockModules,
        },
      },
    },
    {
      request: {
        query: UPDATE_MODULE_STATUS,
        variables: { moduleId: '1', status: 'in_progress' },
      },
      result: {
        data: {
          updateModuleStatus: {
            id: '1',
            status: 'in_progress',
          },
        },
      },
    },
  ];

  const mockReduxStore = mockStore({
    summary: {
      analyses: {},
      loading: false,
      error: null
    }
  });

  const renderComponent = () => {
    return render(
      <Provider store={mockReduxStore}>
        <MockedProvider mocks={mocks} addTypename={false}>
          <BrowserRouter>
            <ModuleList courseId="course1" />
          </BrowserRouter>
        </MockedProvider>
      </Provider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockReduxStore.clearActions();
  });

  it('shows loading state initially', () => {
    renderComponent();
    expect(screen.getByTestId('module-list-loading')).toBeInTheDocument();
  });

  it('renders modules after loading', async () => {
    renderComponent();
    await waitFor(() => {
      expect(screen.getByText('Module 1')).toBeInTheDocument();
    });
  });

  it('expands module content when clicked', async () => {
    renderComponent();
    await waitFor(() => {
      expect(screen.getByText('Module 1')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Module 1'));
    expect(screen.getByText('Resource 1')).toBeInTheDocument();
    expect(screen.getByText('Practice Question 1')).toBeInTheDocument();
  });

  it('navigates to quiz when quiz button is clicked', async () => {
    renderComponent();
    await waitFor(() => {
      expect(screen.getByText('Take Quiz')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Take Quiz'));
    expect(mockNavigate).toHaveBeenCalledWith('/quiz/q1');
  });

  it('shows progress information', async () => {
    renderComponent();
    await waitFor(() => {
      expect(screen.getByText('Course Progress')).toBeInTheDocument();
      expect(screen.getByText('0/1 Modules')).toBeInTheDocument();
    });
  });
}); 