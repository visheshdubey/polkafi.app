import { useEffect, useRef, useState } from 'react';

interface UseIntersectionObserverProps {
    threshold?: number;
    root?: Element | null;
    rootMargin?: string;
    enabled?: boolean;
}

export const useIntersectionObserver = ({
    threshold = 0.1,
    root = null,
    rootMargin = '0px',
    enabled = true,
}: UseIntersectionObserverProps = {}) => {
    const targetRef = useRef<HTMLDivElement | null>(null);
    const [isIntersecting, setIsIntersecting] = useState(false);

    useEffect(() => {
        if (!enabled) {
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    setIsIntersecting(entry.isIntersecting);
                });
            },
            {
                threshold,
                root,
                rootMargin,
            }
        );

        const element = targetRef.current;
        if (element) {
            observer.observe(element);
        }

        return () => {
            if (element) {
                observer.unobserve(element);
            }
        };
    }, [enabled, root, rootMargin, threshold]);

    return { targetRef, isIntersecting };
};