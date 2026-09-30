import { useEffect } from 'react';
import { Link, Route, Routes, useLocation } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import { RequireAdmin } from './context/Auth.jsx';
import Home from './pages/Home.jsx';
import Events from './pages/Events.jsx';
import EventDetails from './pages/EventDetails.jsx';
import Register from './pages/Register.jsx';
import AdminLogin from './pages/admin/Login.jsx';
import AdminLayout from './pages/admin/AdminLayout.jsx';
import Dashboard from './pages/admin/Dashboard.jsx';
import ManageEvents from './pages/admin/ManageEvents.jsx';
import Registrations from './pages/admin/Registrations.jsx';

function ScrollTop() {
  const { pathname } = useLocation();
  useEffect(() => window.scrollTo(0, 0), [pathname]);
  return null;
}

const NotFound = () => (
  <div className="mx-auto max-w-md px-4 py-24 text-center">
    <h1 className="text-5xl font-bold">404</h1>
    <p className="mt-3 text-ink/60">That page doesn't exist or has moved.</p>
    <Link to="/" className="btn btn-primary mt-6">Back to home</Link>
  </div>
);

export default function App() {
  return (
    <>
      <ScrollTop />
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="events" element={<Events />} />
          <Route path="events/:id" element={<EventDetails />} />
          <Route path="events/:id/register" element={<Register />} />
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route path="admin/login" element={<AdminLogin />} />
        <Route path="admin" element={<RequireAdmin><AdminLayout /></RequireAdmin>}>
          <Route index element={<Dashboard />} />
          <Route path="events" element={<ManageEvents />} />
          <Route path="registrations" element={<Registrations />} />
        </Route>
      </Routes>
    </>
  );
}
