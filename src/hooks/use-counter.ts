import { useState, useEffect } from "react";

export const useCounter = (end: number, duration: number = 2000) => {
    const [count, setCount] = useState<number>(0);
    const [isVisible, setIsVisible] = useState<boolean>(false);

    useEffect(() => {
        if (!isVisible) return;
        let startTime: number | undefined;
        const animate = (currentTime: number) => {
            if (!startTime) startTime = currentTime;
            const progress = (currentTime - startTime) / duration;
            if (progress < 1) {
                setCount(Math.floor(end * progress));
                requestAnimationFrame(animate);
            } else {
                setCount(end);
            }
        };
        requestAnimationFrame(animate);
    }, [isVisible, end, duration]);

    return { count, setIsVisible };
};