import { useNavigate } from 'react-router-dom';
import { BookOpen, Receipt } from 'lucide-react';

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 py-4">
        <div className="container mx-auto px-4">
          <img src="/logo.png" alt="Logo" className="h-11 w-auto" />
        </div>
      </header>

      {/* Main */}
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="heading-font mb-14">
          Bookstore Management
        </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Inventory */}
            <button
              onClick={() => navigate('/inventory')}
              className="bg-white border border-gray-300 rounded-xl p-8
                         hover:border-red-800 hover:shadow-lg
                         transition-all duration-300"
            >
              <div className="flex flex-col items-center gap-4">
                <div className="w-14 h-14 bg-red-800 rounded-full flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>

                <h3 className="subheading-font text-lg uppercase">
                  View Inventory
                </h3>

                <p className="text-sm text-gray-700 max-w-xs">
                  View, add, edit, and manage book stock details
                </p>
              </div>
            </button>

            {/* Billing */}
            <button
              onClick={() => navigate('/billing')}
              className="bg-white border border-gray-300 rounded-xl p-8
                         hover:border-red-800 hover:shadow-lg
                         transition-all duration-300"
            >
              <div className="flex flex-col items-center gap-4">
                <div className="w-14 h-14 bg-red-800 rounded-full flex items-center justify-center">
                  <Receipt className="w-6 h-6 text-white" />
                </div>

                <h3 className="subheading-font text-lg uppercase">
                  Billing
                </h3>

                <p className="text-sm text-gray-700 max-w-xs">
                  Create bills and download invoices
                </p>
              </div>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
