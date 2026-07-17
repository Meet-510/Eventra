import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/axios';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Reveal from '../components/Reveal';
import { FaTicketAlt, FaTimesCircle, FaArrowRight } from 'react-icons/fa';

const statusChip = (status) =>
    status === 'confirmed' ? 'chip-emerald' : status === 'cancelled' ? 'chip-red' : 'chip-amber';

const UserDashboard = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        fetchBookings();
    }, [user, navigate]);

    const fetchBookings = async () => {
        try {
            const { data } = await api.get('/bookings/my');
            setBookings(data);
        } catch (error) {
            console.error('Error fetching bookings', error);
        } finally {
            setLoading(false);
        }
    };

    const cancelBooking = async (id) => {
        if (window.confirm('Are you sure you want to cancel this booking request?')) {
            try {
                await api.delete(`/bookings/${id}`);
                fetchBookings();
            } catch (error) {
                alert(error.response?.data?.message || 'Error cancelling booking');
            }
        }
    };

    if (loading) {
        return (
            <div className="mx-auto max-w-6xl space-y-8">
                <div className="skeleton h-32 w-full !rounded-3xl" />
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {[...Array(3)].map((_, i) => <div key={i} className="skeleton h-56 w-full !rounded-3xl" />)}
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-6xl">
            {/* Profile header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="glass-card relative mb-12 flex flex-col items-center gap-6 overflow-hidden p-8 text-center sm:flex-row sm:p-10 sm:text-left"
            >
                <div className="absolute -top-24 -right-24 h-56 w-56 rounded-full bg-iris-500/10 blur-3xl" aria-hidden="true" />
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-iris-500 to-violet-600 font-display text-3xl font-bold uppercase text-white shadow-glow">
                    {user?.name.charAt(0)}
                </div>
                <div className="flex flex-col items-center sm:items-start">
                    <h1 className="font-display mb-1.5 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                        Welcome, {user?.name}
                    </h1>
                    <p className="flex items-center gap-2 text-sm text-zinc-500">
                        <span className="relative flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                        </span>
                        User Dashboard
                    </p>
                </div>
            </motion.div>

            <Reveal className="mb-8 flex items-center justify-between">
                <h2 className="font-display flex items-center gap-3 text-xl font-bold text-white sm:text-2xl">
                    <FaTicketAlt className="text-iris-400" aria-hidden="true" /> My Booking Requests
                </h2>
            </Reveal>

            {bookings.length === 0 ? (
                <Reveal>
                    <div className="glass-card mx-auto max-w-lg p-14 text-center">
                        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-white/10 bg-white/[0.03]">
                            <FaTicketAlt className="text-3xl text-zinc-600" aria-hidden="true" />
                        </div>
                        <p className="mb-8 text-lg font-medium text-zinc-400">You haven't booked any events yet.</p>
                        <Link to="/" className="btn-primary">
                            Browse Events <FaArrowRight className="text-xs" />
                        </Link>
                    </div>
                </Reveal>
            ) : (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {bookings.map((booking, i) => (
                        <motion.div
                            key={booking._id}
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.15 }}
                            transition={{ duration: 0.55, delay: (i % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
                            className="glass-card glass-card-hover flex flex-col overflow-hidden"
                        >
                            <div className="flex-grow p-6">
                                {booking.eventId ? (
                                    <>
                                        <div className="mb-5 flex items-start justify-between gap-3">
                                            <h3 className="font-display text-lg font-bold leading-snug text-white">{booking.eventId.title}</h3>
                                            <div className="flex shrink-0 flex-col items-end gap-1.5">
                                                <span className={`chip ${statusChip(booking.status)}`}>{booking.status}</span>
                                                {booking.status !== 'cancelled' && (
                                                    <span className={`chip ${booking.paymentStatus === 'paid' ? 'chip-iris' : 'chip-slate'}`}>
                                                        {booking.paymentStatus.replace('_', ' ')}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <dl className="space-y-2 text-sm">
                                            <div className="flex justify-between gap-4">
                                                <dt className="text-zinc-500">Date</dt>
                                                <dd className="font-medium text-zinc-300">{new Date(booking.eventId.date).toLocaleDateString()}</dd>
                                            </div>
                                            <div className="flex justify-between gap-4">
                                                <dt className="text-zinc-500">Amount</dt>
                                                <dd className="font-medium text-zinc-300">{booking.amount === 0 ? 'Free' : `$${booking.amount}`}</dd>
                                            </div>
                                            <div className="flex justify-between gap-4">
                                                <dt className="text-zinc-500">Requested</dt>
                                                <dd className="font-medium text-zinc-300">{new Date(booking.bookedAt).toLocaleDateString()}</dd>
                                            </div>
                                        </dl>
                                    </>
                                ) : (
                                    <p className="italic text-red-400/80">Event details unavailable (might have been deleted)</p>
                                )}
                            </div>
                            <div className="flex items-center justify-between border-t border-white/[0.06] bg-white/[0.02] px-6 py-4">
                                {booking.eventId && booking.status !== 'cancelled' ? (
                                    <>
                                        <Link
                                            to={`/events/${booking.eventId._id}`}
                                            className="text-sm font-semibold text-zinc-300 transition-colors hover:text-iris-300"
                                        >
                                            View Event
                                        </Link>
                                        <button
                                            onClick={() => cancelBooking(booking._id)}
                                            className="flex items-center gap-1.5 text-sm font-semibold text-red-400/80 transition-colors hover:text-red-400"
                                        >
                                            <FaTimesCircle aria-hidden="true" /> Cancel
                                        </button>
                                    </>
                                ) : (
                                    <div className="w-full text-center text-sm italic text-zinc-600">Booking Cancelled</div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default UserDashboard;
