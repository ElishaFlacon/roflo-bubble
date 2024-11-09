import React, { CSSProperties, useEffect, useRef, useState } from "react";
import Draggable from "react-draggable";

interface IBubble {
    index: number;
    style: CSSProperties;
}

export const App: React.FC = () => {
    const [count, setCount] = useState(0);
    const [bubbles, setBubbles] = useState<IBubble[]>([]);
    const [_, setRemoveStack] = useState<number[]>([]);
    const [selectedBubbles, setSelectedBubbles] = useState<Set<number>>(new Set());
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

    const containerRef = useRef<HTMLDivElement>(null);

    const randomNumber = (min: number, max: number) => {
        return Math.floor(Math.random() * (max - min + 1) + min);
    };

    const addNewBubble = () => {
        const size = randomNumber(5, 20);
        const color = "#00b0f0";

        const style: CSSProperties = {
            width: `${size}%`,
            height: `${size * 2}%`,
            background: color
        };

        setCount((self) => self + 1);
        setBubbles((self) => [...self, { index: count, style }]);
        setRemoveStack((self) => [count, ...self]);
    };

    const removeBubble = () => {
        setRemoveStack((self) => {
            const [last, ...rest] = self;
            setBubbles((bubbles) => bubbles.filter((value) => value.index !== last));
            return rest;
        });
    };

    const handleKeydown = (event: KeyboardEvent) => {
        const key = event.key.toLocaleLowerCase();
        if (key === "backspace") {
            removeBubble();
            return;
        }
        if (key === "escape") {
            setSelectedBubbles(new Set());
        }
    };

    const handleSaveBubbleToRemoveStack = (index: number) => {
        setRemoveStack((self) => [index, ...self.filter((i) => i !== index)]);
    };

    const handleRightClick = (event: React.MouseEvent, index: number) => {
        event.preventDefault();
        setSelectedBubbles((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(index)) {
                newSet.delete(index);
            } else {
                newSet.add(index);
            }
            return newSet;
        });
    };

    const handleDragStart = (event: any) => {
        setDraggedIndex(Number(event.target.dataset.index));
    };

    const handleDrag = (_: any, data: any) => {
        if (draggedIndex === null || !selectedBubbles.has(draggedIndex)) {
            return;
        }

        setBubbles((prevBubbles) =>
            prevBubbles.map((bubble) => {
                if (!selectedBubbles.has(bubble.index)) return bubble;

                if (bubble.index === draggedIndex) return bubble;

                const currentTop = parseFloat(bubble.style.top as string) || 0;
                const currentLeft = parseFloat(bubble.style.left as string) || 0;

                return {
                    ...bubble,
                    style: {
                        ...bubble.style,
                        top: `${currentTop + data.deltaY}px`,
                        left: `${currentLeft + data.deltaX}px`
                    }
                };
            })
        );
    };

    useEffect(() => {
        addEventListener("keydown", handleKeydown);

        return () => {
            removeEventListener("keydown", handleKeydown);
        };
    }, []);

    return (
        <div className='app'>
            <button className='button' onClick={addNewBubble}>
                Добавить круг
            </button>

            <div ref={containerRef} className='container'>
                {bubbles.map((value) => (
                    <Draggable
                        onMouseDown={() => handleSaveBubbleToRemoveStack(value.index)}
                        onDrag={handleDrag}
                        onStart={handleDragStart}
                        key={value.index}
                    >
                        <div
                            className='draggable'
                            data-index={value.index}
                            style={{
                                ...value.style,
                                background: selectedBubbles.has(value.index)
                                    ? "#18ccff"
                                    : value.style.background,
                                boxShadow: selectedBubbles.has(value.index)
                                    ? "0px 0px 4px 2px rgba(0, 0, 0, 0.2)"
                                    : "0px 0px 4px 2px rgba(0, 0, 0, 0.1)"
                            }}
                            onContextMenu={(e) => handleRightClick(e, value.index)}
                        />
                    </Draggable>
                ))}
            </div>
        </div>
    );
};
