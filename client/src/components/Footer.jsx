import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaTicketAlt, FaTwitter, FaInstagram, FaGithub, FaLinkedinIn } from 'react-icons/fa';

const socials = [
    { icon: FaTwitter, label: 'Twitter', href: 'https://twitter.com' },
    { icon: FaInstagram, label: 'Instagram', href: 'https://instagram.com' },
    { icon: FaGithub, label: 'GitHub', href: 'https://github.com/Meet-510/Eventra' },
    { icon: FaLinkedinIn, label: 'LinkedIn', href: 'https://linkedin.com' },
];

const Footer = () => {
    const [email, setEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);

    const handleSubscribe = (e) => {
        e.preventDefault();
        if (email.trim()) {
            setSubscribed(true);
            setEmail('');
        }
    };

    return (
        <footer className="relative mt-28 border-t border-white/[0.06]">
            <div className="absolute inset-x-0 -top-px mx-auto h-px w-2/3 bg-gradient-to-r from-transparent via-iris-500/40 to-transparent" aria-hidden="true" />

            <div className="container mx-auto px-6 lg:px-10 pt-16 pb-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-14">
                    {/* Brand */}
                    <div>
                        <Link to="/" className="inline-flex items-center gap-2.5 mb-4 group">
                            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-iris-500 to-violet-600 text-white shadow-glow-sm transition-transform duration-300 group-hover:rotate-[-8deg]">
                                <FaTicketAlt className="text-sm" />
                            </span>
                            <span className="font-display text-xl font-bold tracking-tight text-white">Eventra</span>
                        </Link>
                        <p className="text-sm leading-relaxed text-zinc-500 max-w-xs">
                            The simplest, most dynamic way to discover, book, and host world-class events in your city.
                        </p>
                    </div>

                    {/* Explore */}
                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400 mb-5">Explore</h4>
                        <ul className="space-y-3 text-sm">
                            <li><Link to="/" className="text-zinc-500 hover:text-white transition-colors">Browse Events</Link></li>
                            <li><Link to="/dashboard" className="text-zinc-500 hover:text-white transition-colors">My Bookings</Link></li>
                            <li><Link to="/register" className="text-zinc-500 hover:text-white transition-colors">Create Account</Link></li>
                            <li><Link to="/login" className="text-zinc-500 hover:text-white transition-colors">Sign In</Link></li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400 mb-5">Stay in the loop</h4>
                        {subscribed ? (
                            <p className="text-sm text-emerald-400 animate-fade-up">You're on the list — see you at the next event.</p>
                        ) : (
                            <form onSubmit={handleSubscribe} className="flex gap-2">
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@email.com"
                                    aria-label="Email address for newsletter"
                                    className="field !py-2.5 text-sm flex-1 min-w-0"
                                />
                                <button type="submit" className="btn-primary !py-2.5 !px-5 text-sm shrink-0">Join</button>
                            </form>
                        )}
                        <div className="flex items-center gap-3 mt-7">
                            {socials.map(({ icon: Icon, label, href }) => (
                                <a
                                    key={label}
                                    href={href}
                                    target="_blank"
                                    rel="noreferrer"
                                    aria-label={label}
                                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-zinc-500 transition-all duration-300 hover:-translate-y-1 hover:border-iris-400/50 hover:text-white hover:shadow-glow-sm"
                                >
                                    <Icon className="text-sm" />
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-white/[0.06] pt-8 text-xs text-zinc-600">
                    <span className="font-medium uppercase tracking-[0.18em]">&copy; {new Date().getFullYear()} Eventra Platform</span>
                    <span>Crafted for unforgettable experiences.</span>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
