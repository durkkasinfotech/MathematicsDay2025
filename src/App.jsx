import { Routes, Route } from 'react-router-dom';
import NavBar from './components/layout/NavBar';
import RegistrationForm from './components/RegistrationForm';
import Footer from './components/layout/Footer';

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-grow relative z-0">
        <Routes>
          <Route path="/" element={<RegistrationForm />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;

