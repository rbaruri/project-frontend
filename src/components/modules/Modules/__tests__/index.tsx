import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import Modules from '..';
import { fetchModulesRequest } from '@/containers/Modules/moduleActions';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe('Modules', () => {
  const mockModule = {
    id: '1',
    title: 'Test Module',
    description: 'Test Description',
    quiz: {
      id: 'q1',
      questions: [
        {
          id: 'q1',
          question: 'Test Question',
          options: ['A', 'B', 'C', 'D'],
          correctAnswer: 'A'
        }
      ]
    }
  };

  it('shows loading state', () => {
    const store = mockStore({
      modules: {
        data: [],
        loading: true,
        error: null
      }
    });

    render(
      <Provider store={store}>
        <Modules />
      </Provider>
    );

    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('shows error state', () => {
    const errorMessage = 'Test error';
    const store = mockStore({
      modules: {
        data: [],
        loading: false,
        error: errorMessage
      }
    });

    render(
      <Provider store={store}>
        <Modules />
      </Provider>
    );

    expect(screen.getByText(`Error loading modules: ${errorMessage}`)).toBeInTheDocument();
  });

  it('shows empty state when no modules', () => {
    const store = mockStore({
      modules: {
        data: [],
        loading: false,
        error: null
      }
    });

    render(
      <Provider store={store}>
        <Modules />
      </Provider>
    );

    expect(screen.getByText('No modules available')).toBeInTheDocument();
  });

  it('dispatches fetch modules on mount', () => {
    const store = mockStore({
      modules: {
        data: [],
        loading: true,
        error: null
      }
    });

    render(
      <Provider store={store}>
        <Modules />
      </Provider>
    );

    const actions = store.getActions();
    expect(actions[0]).toEqual(fetchModulesRequest());
  });

  it('renders module content when data is available', () => {
    const store = mockStore({
      modules: {
        data: [mockModule],
        loading: false,
        error: null
      }
    });

    render(
      <Provider store={store}>
        <Modules />
      </Provider>
    );

    expect(screen.getByText(mockModule.title)).toBeInTheDocument();
  });
}); 