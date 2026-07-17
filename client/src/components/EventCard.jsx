import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaMapMarkerAlt, FaArrowRight } from 'react-icons/fa';

const EventCard = ({ event, index = 0 }) => {
    const seatsRatio = event.totalSeats > 0 ? event.availableSeats / event.totalSeats : 0;
    const lowSeats = event.availableSeats > 0 && event.availableSeats < 10;

    return (
        <motion.article
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.6, delay: (index % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="glass-card glass-card-hover group flex flex-col overflow-hidden"
        >
            {/* Image */}
            <div className="relative h-52 overflow-hidden">
                {event.image ? (
                    <img
                        src={event.image}
                        alt={event.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-ink-800 to-ink-900 font-display text-2xl font-bold uppercase tracking-widest text-white/20">
                        {event.category || 'Event'}
                    </div>
                )}
                {/* Cinematic bottom fade */}
                <div className="absolute inset-0 bg-gradient-to-t from-ink-900/90 via-transparent to-transparent" aria-hidden="true" />

                {/* Category badge */}
                <span className="chip chip-iris absolute top-4 left-4 backdrop-blur-md">{event.category}</span>

                {/* Price */}
                <span className="absolute bottom-4 right-4 rounded-full border border-white/15 bg-ink-900/70 px-3.5 py-1.5 text-sm font-bold text-white backdrop-blur-md">
                    {event.ticketPrice === 0 ? <span className="text-emerald-400">Free</span> : `$${event.ticketPrice}`}
                </span>
            </div>

            {/* Body */}
            <div className="flex flex-grow flex-col p-6">
                <h3 className="font-display text-lg font-bold leading-snug text-white mb-3 transition-colors duration-300 group-hover:text-iris-300">
                    {event.title}
                </h3>

                <div className="mb-6 space-y-2 text-sm text-zinc-400">
                    <div className="flex items-center gap-2.5">
                        <FaCalendarAlt className="text-zinc-600 shrink-0" />
                        <span>{new Date(event.date).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                        <FaMapMarkerAlt className="text-zinc-600 shrink-0" />
                        <span className="truncate">{event.location}</span>
                    </div>
                </div>

                <div className="mt-auto">
                    {/* Seats */}
                    <div className="mb-1.5 h-1 w-full overflow-hidden rounded-full bg-white/[0.07]">
                        <div
                            className={`h-full rounded-full transition-all duration-700 ${lowSeats ? 'bg-amber-400/80' : 'bg-gradient-to-r from-iris-500 to-violet-400'}`}
                            style={{ width: `${seatsRatio * 100}%` }}
                        />
                    </div>
                    <p className="mb-5 text-xs text-zinc-500">
                        {event.availableSeats <= 0
                            ? 'Sold out'
                            : `${event.availableSeats} of ${event.totalSeats} seats remaining${lowSeats ? ' — selling fast' : ''}`}
                    </p>

                    <Link
                        to={`/events/${event._id}`}
                        className="btn-ghost w-full !py-2.5 text-sm group/btn"
                    >
                        View Details
                        <FaArrowRight className="text-xs transition-transform duration-300 group-hover/btn:translate-x-1" />
                    </Link>
                </div>
            </div>
        </motion.article>
    );
};

export default EventCard;
