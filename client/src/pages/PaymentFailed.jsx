import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';

const PaymentFailed = () => {
    return (
        <div className="flex min-h-[65vh] flex-col items-center justify-center p-4">
            <div className="relative w-full max-w-md">
                <div className="absolute -inset-8 rounded-[2.5rem] bg-red-500/10 blur-3xl" aria-hidden="true" />

                <motion.div
                    initial={{ opacity: 0, y: 28, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    className="glass-card relative p-10 text-center sm:p-12"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.25, type: 'spring', stiffness: 220, damping: 14 }}
                        className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full border border-red-400/30 bg-red-400/10 text-3xl text-red-400 shadow-[0_0_40px_-8px_rgba(248,113,113,0.5)]"
                    >
                        <FaTimes aria-hidden="true" />
                    </motion.div>

                    <h1 className="font-display mb-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">Booking Failed</h1>
                    <p className="mb-10 leading-relaxed text-zinc-400">
                        We couldn't process your payment. Please ensure your payment details are correct and try again.
                    </p>

                    <div className="space-y-3">
                        <Link to="/" className="btn-primary w-full !py-3.5">
                            Return to Events
                        </Link>
                        <Link to="/dashboard" className="btn-ghost w-full !py-3.5">
                            Go to Dashboard
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default PaymentFailed;
