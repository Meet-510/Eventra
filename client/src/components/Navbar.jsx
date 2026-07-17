import React, { useContext, useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import { FaTicketAlt, FaBars, FaTimes } from 'react-icons/fa';

const linkBase = 'relative px-3 py-2 text-sm font-medium transition-colors duration-300';

const NavItem = ({ to, children, onClick }) => (
    <NavLink to={to} onClick={onClick} className={linkBase} end={to === '/'}>
        {({ isActive }) => (
            <>
                <span className={isActive ? 'text-white' : 'text-zinc-400 hover:text-white transition-colors'}>{children}</span>
                {isActive && (
                    <motion.span
                        layoutId="nav-active"
                        className="absolute inset-x-2 -bottom-0.5 h-px bg-gradient-to-r from-transparent via-iris-400 to-transparent"
                        transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    />
                )}
            </>
        )}
    </NavLink>
);

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 12);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const handleLogout = () => {
        setMenuOpen(false);
        logout();
        navigate('/login');
    };

    const closeMenu = () => setMenuOpen(false);

    return (
        <header className="fixed top-0 inset-x-0 z-50 px-4 pt-4">
            <motion.nav
                initial={{ y: -80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className={`mx-auto max-w-6xl rounded-2xl transition-all duration-500 ${scrolled
                    ? 'glass shadow-lift bg-ink-900/70'
                    : 'border border-transparent bg-transparent'
                    }`}
            >
                <div className="flex items-center justify-between px-5 py-3">
                    <Link to="/" onClick={closeMenu} className="flex items-center gap-2.5 group">
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-iris-500 to-violet-600 text-white shadow-glow-sm transition-transform duration-300 group-hover:rotate-[-8deg] group-hover:scale-105">
                            <FaTicketAlt className="text-sm" />
                        </span>
                        <span className="font-display text-xl font-bold tracking-tight text-white">Eventra</span>
                    </Link>

                    {/* Desktop links */}
                    <div className="hidden md:flex items-center gap-1">
                        <NavItem to="/">Events</NavItem>
                        {user ? (
                            <>
                                <NavItem to={user.role === 'admin' ? '/admin' : '/dashboard'}>Dashboard</NavItem>
                                <button
                                    onClick={handleLogout}
                                    className="btn-ghost !py-2 !px-5 text-sm ml-3"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <NavItem to="/login">Login</NavItem>
                                <Link to="/register" className="btn-primary !py-2 !px-5 text-sm ml-3">
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile toggle */}
                    <button
                        className="md:hidden flex h-10 w-10 items-center justify-center rounded-xl text-zinc-300 hover:text-white hover:bg-white/5 transition"
                        onClick={() => setMenuOpen(!menuOpen)}
                        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                        aria-expanded={menuOpen}
                    >
                        {menuOpen ? <FaTimes /> : <FaBars />}
                    </button>
                </div>

                {/* Mobile menu */}
                <AnimatePresence>
                    {menuOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                            className="md:hidden overflow-hidden border-t border-white/[0.06]"
                        >
                            <div className="flex flex-col gap-1 p-4">
                                <NavItem to="/" onClick={closeMenu}>Events</NavItem>
                                {user ? (
                                    <>
                                        <NavItem to={user.role === 'admin' ? '/admin' : '/dashboard'} onClick={closeMenu}>Dashboard</NavItem>
                                        <button onClick={handleLogout} className="btn-ghost !py-2.5 text-sm mt-2">Logout</button>
                                    </>
                                ) : (
                                    <>
                                        <NavItem to="/login" onClick={closeMenu}>Login</NavItem>
                                        <Link to="/register" onClick={closeMenu} className="btn-primary !py-2.5 text-sm mt-2">Sign Up</Link>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.nav>
        </header>
    );
};

export default Navbar;
