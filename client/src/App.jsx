import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { HotelProvider } from './context/HotelContext';
import AppRouter from './routes/index';

const App = () => {
  return (
    <AuthProvider>
      <HotelProvider>
        <AppRouter />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              fontFamily: 'var(--font-primary)',
              fontSize: '14px',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-lg)',
            },
            success: {
              iconTheme: { primary: '#10B981', secondary: '#fff' },
            },
            error: {
              iconTheme: { primary: '#EF4444', secondary: '#fff' },
            },
          }}
        />
      </HotelProvider>
    </AuthProvider>
  );
};

export default App;
