import './App.css';

import React, {useState, useEffect, useRef} from 'react';

function App() {
    const connectButtonRef = useRef()
    const disconnectButtonRef = useRef()
    const [message, setMessage] = useState("In Lightning App")
    const [showEve, setShowEve] = useState(false)

    // Sets up a message listener to handle 'pressButton' events sent via postMessage.
    useEffect(() => {
        const handleMessage = (event) => {
            if (event.data === 'Connect') {
                connectButtonRef.current?.click()
            }
            if (event.data === 'Disconnect') {
                disconnectButtonRef.current?.click()
            }
        }
        window.addEventListener('message', handleMessage)
        return () => window.removeEventListener('message', handleMessage)
    }, [])
    
    function handleConnect(){
        console.log("Connect button pressed in React app")
        setShowEve(true)
    }

    function handleDisconnect(){
        console.log("Disconnect button pressed in React app")
        setShowEve(false)
    }

    return (
        <div className="App">
            {showEve ? (
                <>
                <img
                    src="/Eve.png"
                    alt="Assistant"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
                <div style={{ position: 'absolute', bottom: '30px', width: '100%', textAlign: 'center' }}>
                    <button ref={disconnectButtonRef} onClick={handleDisconnect}>Press Arrow Down To Disconnect</button>
                </div>
            </>
            ): (
                <div className="button">
                    <h3>{message}</h3>
                    <button ref={connectButtonRef} onClick={handleConnect}>Press Arrow Up To Connect</button>
                </div>
            )}
        </div>
    );
}

export default App;