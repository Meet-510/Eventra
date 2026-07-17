import React from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

/** Thin gradient bar at the very top tracking scroll progress. */
const ScrollProgress = () => {
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 28, restDelta: 0.001 });

    return (
        <motion.div
            aria-hidden="true"
            className="fixed top-0 left-0 right-0 z-[60] h-[2px] origin-left bg-gradient-to-r from-iris-500 via-violet-400 to-cyan-400"
            style={{ scaleX }}
        />
    );
};

export default ScrollProgress;
