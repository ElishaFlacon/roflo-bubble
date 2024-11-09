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
    };

    const handleSaveRemoveBubble = (index: number) => {
        setRemoveStack((self) => [index, ...self.filter((i) => i !== index)]);
    };

    useEffect(() => {
        addEventListener("keydown", handleKeydown);

        return () => {
            removeEventListener("keydown", handleKeydown);
        };
    });

    return (
        <div className='app'>
            <button className='button' onClick={addNewBubble}>
                Добавить круг
            </button>

            <div ref={containerRef} className='container'>
                {bubbles.map((value) => (
                    <Draggable
                        onMouseDown={() => handleSaveRemoveBubble(value.index)}
                        key={value.index}
                    >
                        <div className='draggable' style={value.style} />
                    </Draggable>
                ))}
            </div>
        </div>
    );
};
