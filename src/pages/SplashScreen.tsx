import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SplashScreen: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer: number = window.setTimeout(() => {
      navigate('/home');
    }, 2000);

    return () => window.clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-maroon-to-white">
      <img
        src="/logo.png"
        alt="Logo"
        className="w-64 h-auto opacity-0 animate-logo-fade"
      />
    </div>
  );
};

export default SplashScreen;
