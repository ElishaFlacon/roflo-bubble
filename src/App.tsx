import React, { CSSProperties, useEffect, useRef, useState } from "react";
import Draggable from "react-draggable";
import { Bubble } from "./Bubble";

interface IBubble {
    index: number;
    style: CSSProperties;
    currentType: string;
}

export const App: React.FC = () => {
    const [count, setCount] = useState(0);
    const [currentType, setCurrentType] = useState("native");
    const [bubbles, setBubbles] = useState<IBubble[]>([]);
    const [lastTake, setLastTake] = useState(0);

    const containerRef = useRef<HTMLDivElement>(null);

    const addNewBubble = () => {
        const size = randomNumber(5, 20);
        const color = randomColor();

        const style: CSSProperties = {
            width: `${size}%`,
            height: `${size * 2}%`,
            background: color
        };

        setCount((self) => self + 1);
        setBubbles((self) => [...self, { index: count, style, currentType }]);
    };

    const removeBubble = (event: KeyboardEvent) => {
        if (event.key.toLocaleLowerCase() !== "escape") return;
        setBubbles((self) => self.filter((value) => value.index !== lastTake));
    };

    const randomNumber = (min: number, max: number) => {
        return Math.floor(Math.random() * (max - min + 1) + min);
    };

    const randomColor = () => {
        const randomColor = Math.floor(Math.random() * 16777215).toString(16);
        return "#" + randomColor;
    };

    useEffect(() => {
        addEventListener("keydown", removeBubble);
        return () => removeEventListener("keydown", removeBubble);
    });

    return (
        <div className='app'>
            <div>
                {"Привет, не забудьте посмотреть мое резюме --> "}
                <a
                    className='link'
                    href='https://eelisey.ru/portfolio-site/sokolov_elisey_frontend_developer.pdf'
                    target='_blank'
                >
                    Жмяв чтобы резюме!
                </a>
            </div>

            <div>
                Сделал 2 вариации, нативная и спомощью либы, у нативных шариков есть куча багов))
            </div>

            <div> Сейчас выбран тип: {currentType}</div>

            <button
                className='button-small'
                onClick={() => {
                    if (currentType === "react draggable") {
                        setCurrentType("native");
                        return;
                    }

                    setCurrentType("react draggable");
                }}
            >
                Сменить тип шариков
            </button>

            <button className='button' onClick={addNewBubble}>
                ЖМЯВ ЧТОБЫ ШАРИК
            </button>

            <div>ESC для удалить последний пожамканный шарик</div>

            <div ref={containerRef} className='container'>
                {bubbles.map((value) =>
                    value.currentType === "native" ? (
                        <Bubble
                            key={value.index}
                            onMouseDown={() => setLastTake(() => value.index)}
                            containerRef={containerRef}
                            style={value.style}
                        >
                            {value.index} Нативный
                        </Bubble>
                    ) : (
                        <Draggable
                            onMouseDown={() => setLastTake(() => value.index)}
                            key={value.index}
                        >
                            <div className='draggable' style={value.style}>
                                <div>{value.index}</div>
                                <div>React Draggable</div>
                            </div>
                        </Draggable>
                    )
                )}
            </div>
        </div>
    );
};
