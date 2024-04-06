import React, { CSSProperties, useState } from "react";
import Draggable from "react-draggable";

export const App: React.FC = () => {
    const [bubbles, setBubbles] = useState<{ index: number; style: CSSProperties }[]>([]);

    const addNewBubble = () => {
        const size = randomNumber(5, 20);
        const color = randomColor();

        const style: CSSProperties = {
            width: `${size}%`,
            height: `${size * 1.3}%`,
            background: color
        };

        setBubbles((self) => [...self, { index: self.length, style }]);
    };

    const randomNumber = (min: number, max: number) => {
        return Math.floor(Math.random() * (max - min + 1) + min);
    };

    const randomColor = () => {
        const randomColor = Math.floor(Math.random() * 16777215).toString(16);
        return "#" + randomColor;
    };

    return (
        <div className='app'>
            <button className='button' onClick={addNewBubble}>
                ЖМЯВ ЧТОБЫ ШАРИК
            </button>

            <div className='container'>
                {bubbles.map((value) => {
                    return (
                        <Draggable key={value.index}>
                            <div className='draggable' style={value.style}>
                                {value.index}
                            </div>
                        </Draggable>
                    );
                })}
            </div>
        </div>
    );
};
