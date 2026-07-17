import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../utils/axios';
import { AuthContext } from '../context/AuthContext';
import Reveal from '../components/Reveal';
import { FaCalendarAlt, FaMapMarkerAlt, FaChair, FaMoneyBillWave, FaUserCircle } from 'react-icons/fa';

const InfoRow = ({ icon: Icon, label, children }) => (
    <div className="flex items-center gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-iris-300">
            <Icon />
        </div>
        <div className="min-w-0">
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-zinc-500">{label}</p>
            <p className="truncate font-semibold text-white">{children}</p>
        </div>
    </div>
);

const EventDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [bookingLoading, setBookingLoading] = useState(false);
    const [otp, setOtp] = useState('');
    const [showOTP, setShowOTP] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const { data } = await api.get(`/events/${id}`);
                setEvent(data);
            } catch (err) {
                setError('Failed to load event details.');
            } finally {
                setLoading(false);
            }
        };
        fetchEvent();
    }, [id]);

    const handleBooking = async () => {
        if (!user) {
            navigate('/login');
            return;
        }
        setBookingLoading(true);
        setError('');
        setSuccessMsg('');

        try {
            if (!showOTP) {
                await api.post('/bookings/send-otp');
                setShowOTP(true);
                setSuccessMsg('OTP sent to your email. Please verify to confirm booking.');
            } else {
                await api.post('/bookings', { eventId: event._id, otp });
                setSuccessMsg('Booking requested! Awaiting admin confirmation.');
                setShowOTP(false);
                // Update local seats count dynamically after booking
                setEvent({ ...event, availableSeats: event.availableSeats - 1 });
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Booking failed');
        } finally {
            setBookingLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="mx-auto max-w-5xl">
                <div className="skeleton h-[26rem] w-full !rounded-3xl" />
                <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
                    <div className="space-y-4 lg:col-span-2">
                        <div className="skeleton h-8 w-2/3" />
                        <div className="skeleton h-4 w-full" />
                        <div className="skeleton h-4 w-5/6" />
                    </div>
                    <div className="skeleton h-80 w-full !rounded-3xl" />
                </div>
            </div>
        );
    }

    if (error && !event) {
        return (
            <div className="glass-card mx-auto max-w-lg p-14 text-center">
                <p className="text-lg font-medium text-red-400">{error || 'Event not found'}</p>
            </div>
        );
    }

    const isSoldOut = event.availableSeats <= 0;
    const seatsRatio = event.totalSeats > 0 ? event.availableSeats / event.totalSeats : 0;

    return (
        <div className="mx-auto max-w-6xl">
            {/* ============ IMMERSIVE HERO ============ */}
            <motion.div
                initial={{ opacity: 0, scale: 0.985 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="relative h-[24rem] overflow-hidden rounded-3xl border border-white/[0.08] shadow-lift sm:h-[28rem]"
            >
                {event.image ? (
                    <img src={event.image} alt={event.title} className="h-full w-full object-cover" />
                ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-ink-800 to-ink-950 font-display text-6xl font-bold uppercase tracking-widest text-white/10">
                        {event.category}
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/40 to-transparent" aria-hidden="true" />

                <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-12">
                    <span className="chip chip-iris mb-4 backdrop-blur-md">{event.category}</span>
                    <h1 className="font-display max-w-3xl text-3xl font-bold leading-tight tracking-tight text-white sm:text-5xl">
                        {event.title}
                    </h1>
                </div>
            </motion.div>

            {/* ============ CONTENT + STICKY BOOKING PANEL ============ */}
            <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-3">
                {/* About */}
                <div className="lg:col-span-2">
                    <Reveal>
                        <h2 className="font-display mb-5 text-2xl font-bold text-white">About this event</h2>
                        <p className="text-lg leading-relaxed text-zinc-400 whitespace-pre-line">{event.description}</p>
                    </Reveal>

                    {event.createdBy?.name && (
                        <Reveal delay={0.1} className="mt-10">
                            <div className="glass-card flex items-center gap-4 p-6">
                                <FaUserCircle className="text-4xl text-zinc-600" aria-hidden="true" />
                                <div>
                                    <p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-zinc-500">Organized by</p>
                                    <p className="font-semibold text-white">{event.createdBy.name}</p>
                                </div>
                            </div>
                        </Reveal>
                    )}
                </div>

                {/* Booking panel */}
                <div className="lg:sticky lg:top-28 h-fit">
                    <Reveal delay={0.15}>
                        <div className="glass-card relative overflow-hidden p-7">
                            <div className="absolute -top-20 -right-20 h-48 w-48 rounded-full bg-iris-500/10 blur-3xl" aria-hidden="true" />

                            <h3 className="font-display mb-7 text-xl font-bold text-white">Booking Details</h3>

                            <div className="mb-8 space-y-5">
                                <InfoRow icon={FaMoneyBillWave} label="Ticket Price">
                                    {event.ticketPrice === 0 ? <span className="text-emerald-400">Free</span> : `$${event.ticketPrice}`}
                                </InfoRow>
                                <InfoRow icon={FaChair} label="Availability">
                                    <span className={event.availableSeats < 10 ? 'text-amber-400' : ''}>{event.availableSeats}</span>
                                    <span className="text-zinc-500"> / {event.totalSeats}</span>
                                </InfoRow>
                                <InfoRow icon={FaCalendarAlt} label="Date">
                                    {new Date(event.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                                </InfoRow>
                                <InfoRow icon={FaMapMarkerAlt} label="Location">
                                    {event.location}
                                </InfoRow>
                            </div>

                            {/* Seat availability bar */}
                            <div className="mb-7">
                                <div className="h-1 w-full overflow-hidden rounded-full bg-white/[0.07]">
                                    <div
                                        className="h-full rounded-full bg-gradient-to-r from-iris-500 to-violet-400 transition-all duration-700"
                                        style={{ width: `${seatsRatio * 100}%` }}
                                    />
                                </div>
                            </div>

                            {showOTP && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                                    className="mb-5 overflow-hidden"
                                >
                                    <label className="mb-2 block text-sm font-semibold text-zinc-300">Enter OTP to Confirm</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="6-digit code"
                                        className="field text-center text-lg font-bold tracking-[0.4em]"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        maxLength="6"
                                    />
                                </motion.div>
                            )}

                            <button
                                onClick={handleBooking}
                                disabled={isSoldOut || bookingLoading || (showOTP && !otp)}
                                className={`w-full text-base !py-4 ${isSoldOut || (successMsg && !showOTP) ? 'btn-ghost !cursor-not-allowed opacity-50' : 'btn-primary'}`}
                            >
                                {bookingLoading ? (
                                    <span className="inline-flex items-center gap-2">
                                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" aria-hidden="true" />
                                        Processing...
                                    </span>
                                ) : (
                                    showOTP ? 'Verify OTP & Confirm' : (successMsg && !showOTP ? 'Request Sent' : (isSoldOut ? 'Sold Out' : 'Confirm Registration'))
                                )}
                            </button>

                            {error && (
                                <p className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-center text-sm font-medium text-red-400" role="alert">
                                    {error}
                                </p>
                            )}
                            {successMsg && (
                                <p className="mt-4 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-center text-sm font-medium text-emerald-400" role="status">
                                    {successMsg}
                                </p>
                            )}
                        </div>
                    </Reveal>
                </div>
            </div>
        </div>
    );
};

export default EventDetail;
