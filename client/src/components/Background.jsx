import React from 'react';

/**
 * Fixed cinematic background: layered aurora glows, a faint grid,
 * and film-grain noise. Pure CSS — GPU-composited transforms only.
 */
const Background = () => {
    return (
        <div className="fixed inset-0 -z-10 overflow-hidden bg-ink-950 noise" aria-hidden="true">
            {/* Radial base lighting */}
            <div
                className="absolute inset-0"
                style={{
                    background:
                        'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(99,102,241,0.13), transparent 60%), radial-gradient(ellipse 60% 40% at 90% 110%, rgba(34,211,238,0.06), transparent 60%)',
                }}
            />

            {/* Aurora blobs */}
            <div className="absolute -top-40 left-1/4 h-[34rem] w-[34rem] rounded-full bg-iris-600/15 blur-[130px] animate-aurora will-change-transform" />
            <div className="absolute top-1/3 -right-48 h-[28rem] w-[28rem] rounded-full bg-violet-700/10 blur-[120px] animate-aurora-alt will-change-transform" />
            <div className="absolute -bottom-56 left-1/3 h-[30rem] w-[30rem] rounded-full bg-cyan-500/[0.07] blur-[140px] animate-aurora will-change-transform" style={{ animationDelay: '-9s' }} />

            {/* Faint structural grid */}
            <div
                className="absolute inset-0 opacity-[0.35]"
                style={{
                    backgroundImage:
                        'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
                    backgroundSize: '72px 72px',
                    maskImage: 'radial-gradient(ellipse 90% 70% at 50% 0%, black 30%, transparent 75%)',
                    WebkitMaskImage: 'radial-gradient(ellipse 90% 70% at 50% 0%, black 30%, transparent 75%)',
                }}
            />
        </div>
    );
};

export default Background;
