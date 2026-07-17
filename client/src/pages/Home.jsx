import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../utils/axios';
import EventCard from '../components/EventCard';
import Reveal from '../components/Reveal';
import { FaSearch, FaRegClock, FaTicketAlt, FaShieldAlt } from 'react-icons/fa';

const features = [
    {
        icon: FaRegClock,
        title: 'Fast Booking',
        text: 'Secure your tickets instantly with a streamlined booking infrastructure built for speed.',
    },
    {
        icon: FaTicketAlt,
        title: 'Seamless Access',
        text: 'Download tickets instantly or manage everything from your personal dashboard with ease.',
    },
    {
        icon: FaShieldAlt,
        title: 'Secure Platform',
        text: 'Every transaction and registration is protected by cutting-edge security and OTP verification.',
    },
];

const SkeletonCard = () => (
    <div className="glass-card overflow-hidden">
        <div className="skeleton h-52 !rounded-none" />
        <div className="space-y-3 p-6">
            <div className="skeleton h-5 w-3/4" />
            <div className="skeleton h-4 w-1/2" />
            <div className="skeleton h-4 w-2/3" />
            <div className="skeleton h-10 w-full !rounded-xl" />
        </div>
    </div>
);

const Home = () => {
    const [events, setEvents] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchEvents();
        }, 400); // 400ms debounce
        return () => clearTimeout(timeoutId);
    }, [search]);

    const fetchEvents = async () => {
        try {
            const { data } = await api.get(`/events?search=${search}`);
            setEvents(data);
        } catch (error) {
            console.error('Error fetching events:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col">
            {/* ============ HERO ============ */}
            <section className="relative flex flex-col items-center px-4 pt-16 pb-24 text-center sm:pt-24">
                <motion.span
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="glass mb-8 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold tracking-[0.18em] text-zinc-300 uppercase"
                >
                    <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-iris-400 opacity-60" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-iris-400" />
                    </span>
                    Live events, curated for you
                </motion.span>

                <motion.h1
                    initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                    className="font-display mx-auto max-w-4xl text-5xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl"
                >
                    Find your next{' '}
                    <span className="text-gradient">unforgettable</span>
                    <br className="hidden sm:block" /> experience
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    className="mx-auto mt-7 max-w-2xl text-lg leading-relaxed text-zinc-400"
                >
                    Discover world-class tech conferences, late-night music festivals, and
                    hands-on workshops happening near you. Secure your spot in seconds.
                </motion.p>

                {/* Search */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="group relative mx-auto mt-12 w-full max-w-xl"
                >
                    <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-iris-500/30 via-violet-500/20 to-cyan-400/20 opacity-0 blur-lg transition-opacity duration-500 group-focus-within:opacity-100" aria-hidden="true" />
                    <div className="glass relative flex items-center rounded-2xl">
                        <FaSearch className="pointer-events-none absolute left-5 text-zinc-500 transition-colors group-focus-within:text-iris-300" />
                        <input
                            type="text"
                            placeholder="Search events by title..."
                            aria-label="Search events"
                            className="w-full bg-transparent py-4 pl-14 pr-6 text-base text-white placeholder-zinc-500 focus:outline-none"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </motion.div>
            </section>

            {/* ============ FEATURES ============ */}
            <section className="mb-28 grid grid-cols-1 gap-6 px-2 md:grid-cols-3" aria-label="Why choose Eventra">
                {features.map(({ icon: Icon, title, text }, i) => (
                    <Reveal key={title} delay={i * 0.1}>
                        <div className="glass-card glass-card-hover flex h-full flex-col items-center p-9 text-center">
                            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.08] to-transparent text-xl text-iris-300 shadow-glow-sm">
                                <Icon />
                            </div>
                            <h3 className="font-display mb-3 text-lg font-bold text-white">{title}</h3>
                            <p className="text-sm leading-relaxed text-zinc-500">{text}</p>
                        </div>
                    </Reveal>
                ))}
            </section>

            {/* ============ EVENTS ============ */}
            <section aria-label="Upcoming events">
                <Reveal className="mb-10 flex flex-col gap-2 border-b border-white/[0.06] px-2 pb-6 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="eyebrow mb-2">Don't miss out</p>
                        <h2 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">Upcoming Events</h2>
                    </div>
                    <div className="text-sm font-medium text-zinc-500" aria-live="polite">
                        {loading ? 'Searching…' : `${events.length} ${events.length === 1 ? 'result' : 'results'} found`}
                    </div>
                </Reveal>

                {loading ? (
                    <div className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
                        {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
                    </div>
                ) : events.length === 0 ? (
                    <div className="glass-card mx-auto max-w-lg p-14 text-center">
                        <FaSearch className="mx-auto mb-5 text-3xl text-zinc-600" />
                        <p className="text-lg font-medium text-zinc-400">No events found matching your search.</p>
                        <p className="mt-2 text-sm text-zinc-600">Try a different keyword or check back soon.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
                        {events.map((event, index) => (
                            <EventCard key={event._id} event={event} index={index} />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};

export default Home;
