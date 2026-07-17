import React from 'react';
import { motion } from 'framer-motion';

/**
 * Shared shell for auth pages: centered glass panel with an aurora glow,
 * animated entrance, title + subtitle, and alert slots.
 */
const AuthCard = ({ title, subtitle, error, success, children, footer }) => {
    return (
        <div className="relative mx-auto mt-10 max-w-md sm:mt-16">
            {/* Glow behind the card */}
            <div className="absolute -inset-6 rounded-[2rem] bg-gradient-to-br from-iris-500/15 via-transparent to-cyan-400/10 blur-2xl" aria-hidden="true" />

            <motion.div
                initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="glass-card relative p-8 sm:p-10"
            >
                <div className="mb-8 text-center">
                    <h1 className="font-display mb-2 text-3xl font-bold tracking-tight text-white">{title}</h1>
                    {subtitle && <p className="text-sm text-zinc-500">{subtitle}</p>}
                </div>

                {error && (
                    <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-center text-sm font-medium text-red-400" role="alert">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="mb-6 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-center text-sm font-medium text-emerald-400" role="status">
                        {success}
                    </div>
                )}

                {children}

                {footer && <div className="mt-8 text-center text-sm text-zinc-500">{footer}</div>}
            </motion.div>
        </div>
    );
};

export const FieldLabel = ({ children }) => (
    <label className="mb-2 block text-sm font-semibold text-zinc-300">{children}</label>
);

export const SubmitButton = ({ loading, children }) => (
    <button type="submit" disabled={loading} className="btn-primary w-full !py-3.5">
        {loading ? (
            <span className="inline-flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" aria-hidden="true" />
                Processing...
            </span>
        ) : children}
    </button>
);

export default AuthCard;
