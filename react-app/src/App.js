import './App.css';

import React, {useState, useEffect, useRef} from 'react';

function App() {
    const buttonRef = useRef()
    const [message, setMessage] = useState("Press Enter in Lightning App")

    // Sets up a message listener to handle 'pressButton' events sent via postMessage.
    useEffect(() => {
        const handleMessage = (event) => {
            if (event.data === 'pressButton') {
                buttonRef.current?.click()
            }
        }
        window.addEventListener('message', handleMessage)
        return () => window.removeEventListener('message', handleMessage)
    }, [])
    
    function handleClick(){
        console.log("Button Clicked In React App")
        setMessage("Button Pressed")
        setTimeout(() => {
            setMessage("Press Enter in Lightning App")
        }, 500)
    }

    return (
        <div className="App">
        <div className="button">
            <h1>React App</h1>
            <h1>{message}</h1>
            <button ref={buttonRef} onClick={handleClick}>Click Me</button>
        </div>
        </div>
    );
}

export default App;
