import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/Navbar';
import Background from './components/Background';
import ScrollProgress from './components/ScrollProgress';
import Footer from './components/Footer';
import Home from './pages/Home';
import EventDetail from './pages/EventDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentFailed from './pages/PaymentFailed';

const pageVariants = {
    initial: { opacity: 0, y: 14, filter: 'blur(4px)' },
    enter: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
    exit: { opacity: 0, y: -10, filter: 'blur(4px)', transition: { duration: 0.25, ease: 'easeIn' } },
};

const NotFound = () => (
    <div className="flex flex-col items-center justify-center py-40 text-center">
        <p className="eyebrow mb-4">Error 404</p>
        <h1 className="font-display text-5xl font-bold text-white mb-4">Page not found</h1>
        <p className="text-zinc-500">The page you're looking for doesn't exist or has been moved.</p>
    </div>
);

const AppShell = () => {
    const location = useLocation();

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'instant' });
    }, [location.pathname]);

    return (
        <div className="min-h-screen flex flex-col font-sans text-zinc-200">
            <Background />
            <ScrollProgress />
            <Navbar />
            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-8 w-full">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={location.pathname}
                        variants={pageVariants}
                        initial="initial"
                        animate="enter"
                        exit="exit"
                    >
                        <Routes location={location}>
                            <Route path="/" element={<Home />} />
                            <Route path="/events/:id" element={<EventDetail />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/forgot-password" element={<ForgotPassword />} />
                            <Route path="/reset-password/:id/:token" element={<ResetPassword />} />
                            <Route path="/dashboard" element={<UserDashboard />} />
                            <Route path="/admin" element={<AdminDashboard />} />
                            <Route path="/payment-success" element={<PaymentSuccess />} />
                            <Route path="/payment-failed" element={<PaymentFailed />} />
                            <Route path="*" element={<NotFound />} />
                        </Routes>
                    </motion.div>
                </AnimatePresence>
            </main>
            <Footer />
        </div>
    );
};

function App() {
    return (
        <Router>
            <AppShell />
        </Router>
    );
}

export default App;
