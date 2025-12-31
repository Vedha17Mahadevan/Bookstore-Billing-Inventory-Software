import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { InventoryProvider } from './context/InventoryContext';
import SplashScreen from './pages/SplashScreen';
import Home from './pages/Home';
import Inventory from './pages/Inventory';
import Billing from './pages/Billing';
import BillPreview from './pages/BillPreview';

function App() {
  return (
    <InventoryProvider>
      <Router>
        <Routes>
          <Route path="/" element={<SplashScreen />} />
          <Route path="/home" element={<Home />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/billing" element={<Billing />} />
          <Route path="/bill-preview" element={<BillPreview />} />
        </Routes>
      </Router>
    </InventoryProvider>
  );
}

export default App;
