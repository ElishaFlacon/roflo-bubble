import React, { CSSProperties, ReactNode, RefObject, useEffect, useRef } from "react";

interface Props {
    containerRef: RefObject<HTMLDivElement>;
    style?: CSSProperties;
    children?: ReactNode;
}

export const Bubble: React.FC<Props> = ({ containerRef, style, children }) => {
    const boxRef = useRef<HTMLDivElement>(null);

    const isClicked = useRef<boolean>(false);

    const coords = useRef<{
        startX: number;
        startY: number;
        lastX: number;
        lastY: number;
    }>({
        startX: 150,
        startY: 150,
        lastX: 100,
        lastY: 100
    });

    useEffect(() => {
        if (!boxRef.current || !containerRef.current) return;

        const box = boxRef.current;
        const container = containerRef.current;

        const onMouseDown = (e: MouseEvent) => {
            isClicked.current = true;
            coords.current.startX = e.clientX;
            coords.current.startY = e.clientY;
        };

        const onMouseUp = () => {
            isClicked.current = false;
            coords.current.lastX = box.offsetLeft;
            coords.current.lastY = box.offsetTop;
        };

        const onMouseMove = (e: MouseEvent) => {
            if (!isClicked.current) return;

            const nextX = e.clientX - coords.current.startX + coords.current.lastX;
            const nextY = e.clientY - coords.current.startY + coords.current.lastY;

            box.style.top = `${nextY}px`;
            box.style.left = `${nextX}px`;
        };
        const initListeners = () => {
            box.addEventListener("mousedown", onMouseDown);
            box.addEventListener("mouseup", onMouseUp);
            container.addEventListener("mousemove", onMouseMove);
            container.addEventListener("mouseleave", onMouseUp);
        };

        const clearListeners = () => {
            box.removeEventListener("mousedown", onMouseDown);
            box.removeEventListener("mouseup", onMouseUp);
            container.removeEventListener("mousemove", onMouseMove);
            container.removeEventListener("mouseleave", onMouseUp);
        };

        initListeners();
        return clearListeners;
    }, []);

    return (
        <div ref={boxRef} className='draggable' style={style}>
            {children}
        </div>
    );
};
