import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/axios';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Reveal from '../components/Reveal';
import { FaDollarSign, FaUsers, FaHourglassHalf, FaPlus, FaTimes } from 'react-icons/fa';

const statusChip = (status) =>
    status === 'confirmed' ? 'chip-emerald' : status === 'cancelled' ? 'chip-red' : 'chip-amber';

const statusEdge = (status) =>
    status === 'pending' ? 'border-l-amber-400/70' : status === 'confirmed' ? 'border-l-emerald-400/70' : 'border-l-red-400/70';

const StatTile = ({ icon: Icon, label, value, accent, delay = 0 }) => (
    <Reveal delay={delay}>
        <div className="glass-card glass-card-hover flex items-center justify-between p-7">
            <div>
                <p className="mb-2 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-zinc-500">{label}</p>
                <p className="font-display text-3xl font-bold tracking-tight text-white">{value}</p>
            </div>
            <div className={`flex h-12 w-12 items-center justify-center rounded-2xl border text-lg ${accent}`}>
                <Icon aria-hidden="true" />
            </div>
        </div>
    </Reveal>
);

const AdminDashboard = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showEventForm, setShowEventForm] = useState(false);
    const [formData, setFormData] = useState({
        title: '', description: '', date: '', location: '', category: '', totalSeats: '', ticketPrice: '', image: ''
    });

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            navigate('/login');
            return;
        }
        fetchData();
    }, [user, navigate]);

    const fetchData = async () => {
        try {
            const [eventsRes, bookingsRes] = await Promise.all([
                api.get('/events'),
                api.get('/bookings/my') // Admin gets all bookings
            ]);
            setEvents(eventsRes.data);
            setBookings(bookingsRes.data);
        } catch (error) {
            console.error('Error fetching admin data', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateEvent = async (e) => {
        e.preventDefault();
        try {
            await api.post('/events', formData);
            setShowEventForm(false);
            setFormData({ title: '', description: '', date: '', location: '', category: '', totalSeats: '', ticketPrice: '', image: '' });
            fetchData();
        } catch (error) {
            alert(error.response?.data?.message || 'Error creating event');
        }
    };

    const handleDeleteEvent = async (id) => {
        if (window.confirm('Are you sure you want to delete this event?')) {
            try {
                await api.delete(`/events/${id}`);
                fetchData();
            } catch (error) {
                alert('Error deleting event');
            }
        }
    };

    const handleConfirmBooking = async (id, paymentStatus) => {
        try {
            await api.put(`/bookings/${id}/confirm`, { paymentStatus });
            fetchData();
        } catch (error) {
            alert(error.response?.data?.message || 'Error confirming booking');
        }
    };

    const handleCancelBooking = async (id) => {
        if (window.confirm('Cancel this user\'s booking request?')) {
            try {
                await api.delete(`/bookings/${id}`);
                fetchData();
            } catch (error) {
                alert(error.response?.data?.message || 'Error cancelling booking');
            }
        }
    };

    if (loading) {
        return (
            <div className="mx-auto max-w-7xl space-y-8">
                <div className="skeleton h-32 w-full !rounded-3xl" />
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    {[...Array(3)].map((_, i) => <div key={i} className="skeleton h-28 w-full !rounded-3xl" />)}
                </div>
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                    <div className="skeleton h-96 w-full !rounded-3xl" />
                    <div className="skeleton h-96 w-full !rounded-3xl" />
                </div>
            </div>
        );
    }

    const totalRevenue = bookings.reduce((sum, b) => b.paymentStatus === 'paid' && b.status === 'confirmed' ? sum + b.amount : sum, 0);
    const paidClients = new Set(bookings.filter(b => b.paymentStatus === 'paid' && b.status === 'confirmed').map(b => b.userId?._id)).size;
    const pendingCount = bookings.filter(b => b.status === 'pending').length;

    return (
        <div className="mx-auto max-w-7xl">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="glass-card relative mb-10 flex flex-col items-center justify-between gap-6 overflow-hidden p-8 text-center md:flex-row md:p-10 md:text-left"
            >
                <div className="absolute -top-28 -left-20 h-64 w-64 rounded-full bg-iris-500/10 blur-3xl" aria-hidden="true" />
                <div className="relative">
                    <p className="eyebrow mb-2">Control Center</p>
                    <h1 className="font-display mb-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">Admin Dashboard</h1>
                    <p className="text-sm text-zinc-500">Manage events and manually confirm bookings.</p>
                </div>
                <button
                    onClick={() => setShowEventForm(!showEventForm)}
                    className={`${showEventForm ? 'btn-ghost' : 'btn-primary'} relative w-full md:w-auto`}
                >
                    {showEventForm ? (<><FaTimes className="text-xs" aria-hidden="true" /> Cancel Creation</>) : (<><FaPlus className="text-xs" aria-hidden="true" /> Create New Event</>)}
                </button>
            </motion.div>

            {/* Stats */}
            <div className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-3">
                <StatTile
                    icon={FaDollarSign}
                    label="Total Revenue"
                    value={`$${totalRevenue}`}
                    accent="border-emerald-400/20 bg-emerald-400/10 text-emerald-400"
                />
                <StatTile
                    icon={FaUsers}
                    label="Paid Clients"
                    value={paidClients}
                    accent="border-iris-400/20 bg-iris-500/10 text-iris-300"
                    delay={0.08}
                />
                <StatTile
                    icon={FaHourglassHalf}
                    label="Pending Requests"
                    value={pendingCount}
                    accent="border-amber-400/20 bg-amber-400/10 text-amber-400"
                    delay={0.16}
                />
            </div>

            {/* Create event form */}
            <AnimatePresence>
                {showEventForm && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                    >
                        <div className="glass-card mb-10 p-8 sm:p-10">
                            <h2 className="font-display mb-8 text-2xl font-bold text-white">Create New Event</h2>
                            <form onSubmit={handleCreateEvent} className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                <input required type="text" placeholder="Event Title" aria-label="Event title" className="field" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                                <input required type="text" placeholder="Category (e.g., Tech, Music)" aria-label="Category" className="field" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} />
                                <input required type="date" aria-label="Event date" className="field" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} />
                                <input required type="text" placeholder="Location" aria-label="Location" className="field" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} />
                                <input required type="number" placeholder="Total Seats" aria-label="Total seats" className="field" value={formData.totalSeats} onChange={e => setFormData({ ...formData, totalSeats: e.target.value })} />
                                <input required type="number" placeholder="Ticket Price (0 for free)" aria-label="Ticket price" className="field" value={formData.ticketPrice} onChange={e => setFormData({ ...formData, ticketPrice: e.target.value })} />
                                <div className="md:col-span-2">
                                    <input type="text" placeholder="Image URL (Provide any direct link to an image)" aria-label="Image URL" className="field" value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })} />
                                </div>
                                <textarea required placeholder="Event Description" aria-label="Event description" className="field h-32 resize-none md:col-span-2" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                                <button type="submit" className="btn-primary mt-2 md:col-span-2">Publish Event</button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Lists */}
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                {/* Events */}
                <Reveal className="flex flex-col">
                    <h2 className="font-display mb-6 flex items-center gap-3 text-xl font-bold text-white sm:text-2xl">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-sm text-zinc-400">{events.length}</span>
                        All Events
                    </h2>
                    <div className="glass-card overflow-hidden !rounded-2xl">
                        <ul className="max-h-[600px] divide-y divide-white/[0.05] overflow-y-auto">
                            {events.length === 0 ? <li className="p-8 text-center text-zinc-500">No events created yet.</li> :
                                events.map(event => (
                                    <li key={event._id} className="flex flex-col justify-between gap-4 p-5 transition-colors hover:bg-white/[0.02] sm:flex-row sm:items-center">
                                        <div className="min-w-0">
                                            <h4 className="mb-1.5 font-semibold leading-tight text-white">{event.title}</h4>
                                            <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-500">
                                                <span className="flex items-center gap-1.5">
                                                    <span className="h-1.5 w-1.5 rounded-full bg-iris-400" aria-hidden="true" />
                                                    {new Date(event.date).toLocaleDateString()}
                                                </span>
                                                <span className="flex items-center gap-1.5">
                                                    <span className={`h-1.5 w-1.5 rounded-full ${event.availableSeats > 0 ? 'bg-emerald-400' : 'bg-red-400'}`} aria-hidden="true" />
                                                    {event.availableSeats}/{event.totalSeats} seats
                                                </span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleDeleteEvent(event._id)}
                                            className="w-full shrink-0 rounded-xl border border-red-500/25 bg-red-500/[0.06] px-4 py-2 text-sm font-semibold text-red-400 transition-all hover:bg-red-500/90 hover:text-white sm:w-auto"
                                        >
                                            Delete
                                        </button>
                                    </li>
                                ))
                            }
                        </ul>
                    </div>
                </Reveal>

                {/* Bookings */}
                <Reveal delay={0.1} className="flex flex-col">
                    <h2 className="font-display mb-6 flex items-center gap-3 text-xl font-bold text-white sm:text-2xl">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full border border-amber-400/25 bg-amber-400/10 text-sm font-bold text-amber-400">{bookings.length}</span>
                        Booking Requests
                    </h2>
                    <div className="glass-card overflow-hidden !rounded-2xl">
                        <ul className="max-h-[600px] divide-y divide-white/[0.05] overflow-y-auto">
                            {bookings.length === 0 ? <li className="p-8 text-center text-zinc-500">No bookings yet.</li> :
                                bookings.map(booking => (
                                    <li key={booking._id} className={`border-l-2 p-6 transition-colors hover:bg-white/[0.02] ${statusEdge(booking.status)}`}>
                                        <div className="mb-4 flex items-start justify-between gap-3">
                                            <h4 className="font-display font-bold leading-tight text-white">{booking.eventId?.title || 'Deleted Event'}</h4>
                                            <div className="flex shrink-0 flex-col items-end gap-1.5">
                                                <span className={`chip ${statusChip(booking.status)}`}>{booking.status}</span>
                                                {booking.status !== 'cancelled' && (
                                                    <span className={`chip ${booking.paymentStatus === 'paid' ? 'chip-iris' : 'chip-slate'}`}>
                                                        {booking.paymentStatus.replace('_', ' ')}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <dl className="mb-4 space-y-1.5 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 text-sm">
                                            <div className="flex gap-3">
                                                <dt className="w-16 shrink-0 text-[0.65rem] font-bold uppercase tracking-wider text-zinc-600 leading-5">User</dt>
                                                <dd className="min-w-0 text-zinc-300">
                                                    <span className="font-semibold">{booking.userId?.name}</span>{' '}
                                                    <span className="break-all text-zinc-500">({booking.userId?.email})</span>
                                                </dd>
                                            </div>
                                            <div className="flex gap-3">
                                                <dt className="w-16 shrink-0 text-[0.65rem] font-bold uppercase tracking-wider text-zinc-600 leading-5">Amount</dt>
                                                <dd className="font-semibold text-zinc-300">{booking.amount === 0 ? 'Free' : `$${booking.amount}`}</dd>
                                            </div>
                                            <div className="flex gap-3">
                                                <dt className="w-16 shrink-0 text-[0.65rem] font-bold uppercase tracking-wider text-zinc-600 leading-5">Date</dt>
                                                <dd className="text-zinc-400">{new Date(booking.bookedAt).toLocaleString()}</dd>
                                            </div>
                                            {booking.eventId && (
                                                <div className="mt-2 flex gap-3 border-t border-white/[0.06] pt-2">
                                                    <dt className="w-16 shrink-0 text-[0.65rem] font-bold uppercase tracking-wider text-zinc-600 leading-5">Seats</dt>
                                                    <dd className="text-zinc-400">
                                                        <span className="font-bold text-zinc-200">{booking.eventId.availableSeats}</span> remaining of {booking.eventId.totalSeats}
                                                    </dd>
                                                </div>
                                            )}
                                        </dl>

                                        {/* Action buttons for admin */}
                                        {booking.status === 'pending' && (
                                            <div className="flex flex-wrap gap-2">
                                                <button
                                                    onClick={() => handleConfirmBooking(booking._id, 'paid')}
                                                    className="min-w-[130px] flex-1 rounded-xl border border-emerald-500/25 bg-emerald-500/[0.08] px-3 py-2.5 text-xs font-bold text-emerald-400 transition-all hover:bg-emerald-500 hover:text-ink-950"
                                                >
                                                    ✓ Approve as Paid
                                                </button>
                                                <button
                                                    onClick={() => handleConfirmBooking(booking._id, 'not_paid')}
                                                    className="min-w-[130px] flex-1 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 text-xs font-bold text-zinc-300 transition-all hover:bg-white/90 hover:text-ink-950"
                                                >
                                                    ✓ Approve Undecided
                                                </button>
                                                <button
                                                    onClick={() => handleCancelBooking(booking._id)}
                                                    className="w-[90px] rounded-xl border border-red-500/25 bg-red-500/[0.06] px-3 py-2.5 text-xs font-bold text-red-400 transition-all hover:bg-red-500 hover:text-white"
                                                >
                                                    ✕ Reject
                                                </button>
                                            </div>
                                        )}
                                    </li>
                                ))
                            }
                        </ul>
                    </div>
                </Reveal>
            </div>
        </div>
    );
};

export default AdminDashboard;
