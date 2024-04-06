import React, { CSSProperties, useRef, useState } from "react";
import Draggable from "react-draggable";
import { Bubble } from "./Bubble";

export const App: React.FC = () => {
    const [currentType, setCurrentType] = useState("native");
    const [bubbles, setBubbles] = useState<
        { index: number; style: CSSProperties; currentType: string }[]
    >([]);

    const containerRef = useRef<HTMLDivElement>(null);

    const addNewBubble = () => {
        const size = randomNumber(5, 20);
        const color = randomColor();

        const style: CSSProperties = {
            width: `${size}%`,
            height: `${size * 1.3}%`,
            background: color
        };

        setBubbles((self) => [...self, { index: self.length, style, currentType }]);
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

            <div>Сделал 2 вариации, нативная и спомощью либы</div>

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

            <div ref={containerRef} className='container'>
                {bubbles.map((value) =>
                    value.currentType === "native" ? (
                        <Bubble containerRef={containerRef} style={value.style}>
                            {value.index} Нативный
                        </Bubble>
                    ) : (
                        <Draggable key={value.index}>
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
