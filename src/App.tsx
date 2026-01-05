import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import { BookingProvider } from './context/BookingContext';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NotFoundPage from './pages/NotFoundPage';
import ProfilePage from './pages/ProfilePage';
// Trip Planning System Pages
import ExplorePage from './pages/ExplorePage';
import CitiesPage from './pages/CitiesPage';
import ActivitiesPage from './pages/ActivitiesPage';
import MyTripsPage from './pages/MyTripsPage';
import WeatherComparisonPage from './pages/WeatherComparisonPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <BookingProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              {/* Protected Routes - Require Authentication */}
              <Route path="/profile" element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } />
              <Route path="/trips" element={
                <ProtectedRoute>
                  <MyTripsPage />
                </ProtectedRoute>
              } />
              {/* Trip Planning Routes */}
              <Route path="/explore" element={<ExplorePage />} />
              <Route path="/country/:countryId" element={<CitiesPage />} />
              <Route path="/country/:countryId/city/:cityId" element={<ActivitiesPage />} />
              <Route path="/weather" element={<WeatherComparisonPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Layout>
        </BookingProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
