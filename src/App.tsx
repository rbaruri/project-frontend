import AppRoutes from './routes/AppRoutes';
import Navbar from './components/Navbar';
import { FC } from 'react';

const App: FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-4">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <AppRoutes />
            </div>
          </main>
        </div>
      </main>
    </div>
  );
};

export default App;
