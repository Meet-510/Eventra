import React from 'react';
import { motion } from 'framer-motion';

/**
 * Scroll-reveal wrapper: fade + rise + de-blur once, when ~20% enters the viewport.
 * `delay` staggers siblings; `as` changes the rendered element.
 */
const Reveal = ({ children, delay = 0, y = 24, className = '', as = 'div' }) => {
    const Component = motion[as] || motion.div;
    return (
        <Component
            initial={{ opacity: 0, y, filter: 'blur(6px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
            className={className}
        >
            {children}
        </Component>
    );
};

export default Reveal;
