import { useState, useRef } from "react";

export const useScrollDirectionLock = () => {
    const [touchStart, setTouchStart] = useState({ x: 0, y: 0 });
    const [scrollDirection, setScrollDirection] = useState(null);
    const lockTimeout = useRef(null);

    const resetScrollDirection = () => {
        setScrollDirection(null);
        lockTimeout.current = null;
    };

    const handleTouchStart = (e) => {
        setTouchStart({
            x: e.touches[0].clientX,
            y: e.touches[0].clientY,
        });

        // cancel any existing lock reset
        if (lockTimeout.current) {
            clearTimeout(lockTimeout.current);
            lockTimeout.current = null;
        }

        setScrollDirection(null);
    };

    const handleTouchMove = (e) => {
        const deltaX = e.touches[0].clientX - touchStart.x;
        const deltaY = e.touches[0].clientY - touchStart.y;

        if (!scrollDirection) {
            const direction = Math.abs(deltaX) > Math.abs(deltaY) ? "horizontal" : "vertical";
            setScrollDirection(direction);

            // Reset after 200ms so it can detect new gesture direction
            lockTimeout.current = setTimeout(() => {
                resetScrollDirection();
            }, 200);
        }

        // Apply lock if direction is active
        if (scrollDirection === "horizontal") {
            e.preventDefault(); // block vertical
        } else if (scrollDirection === "vertical") {
            e.preventDefault(); // block horizontal
        }
    };

    return {
        handleTouchStart,
        handleTouchMove,
    };
};
