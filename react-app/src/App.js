import './App.css';

import React, {useState, useEffect, useRef} from 'react';
import { initializeConnection, closeWebsocket } from '../src/lib/websocket.js';
import StreamingAvatar, { AvatarQuality, StreamingEvents, TaskType, VoiceEmotion } from "@heygen/streaming-avatar";


function App() {
    const connectButtonRef = useRef()
    const disconnectButtonRef = useRef()
    const socketRef = useRef(null);
    const [message, setMessage] = useState("In Lightning App")
    const [showEve, setShowEve] = useState(false)
    const heygenApiKey = "YmZkN2MwNmViYWIwNDdhMTlhZGI2ZTUxZjI1ZWE5YjMtMTczNzU3MTc2Mg=="; //Create a heygen account for 10 free credits
    const [avatarText, setAvatarText] = useState();
    const avatarVideo = useRef(null);
    const avatar = useRef(null);


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

    useEffect(() => {
        async function avatarSpeak(){
            console.log("Avatar Text: ", avatarText);
            setMessage(avatarText);
            await avatar.current.speak({ text: avatarText, taskType: TaskType.REPEAT }).catch((e) => {
              });
        }
        if(avatarText){
            avatarSpeak();
        }
    }, [avatarText]);

    // Fetch access token for avatar streaming
    async function fetchAccessToken() {
        try {
            const response = await fetch("https://api.heygen.com/v1/streaming.create_token", {
                method: "POST",
                headers: { "x-api-key": heygenApiKey },
            });
            const { data } = await response.json();
            return data.token;
        } catch (error) {
            console.log("Error fetching access token", error);
        }
    }
    
    async function handleConnect(){
        console.log("Connect button pressed in React app")
        setShowEve(true)
        await initializeAvatarSession()

        if (!socketRef.current) {
            socketRef.current = initializeConnection('ws://localhost:8080');
    
            socketRef.current.addEventListener('open', async () => {
                console.log('WebSocket connected');
                socketRef.current.send("Hello")

            });
    
            socketRef.current.addEventListener('message', (event) => {
                setMessage(event.data);
                setAvatarText(event.data)
            });
            
            socketRef.current.addEventListener('close', () => {
                console.log('WebSocket closed');
            });
    
            socketRef.current.addEventListener('error', (error) => {
                console.error('WebSocket error:', error);
            });
        } else {
            console.log("WebSocket already connected.");
        }
    }

    async function handleDisconnect(){
        console.log("Disconnect button pressed in React app")
        setShowEve(false)

        setMessage("Disconnected...");
    
        try {
            if (socketRef.current) {
                closeWebsocket(socketRef.current);
                socketRef.current = null;
            }
            if (avatar.current) {
                try {
                    await avatar.current.stopAvatar();
                } catch (e) {
                    console.warn("Error stopping avatar:", e);
                }
                try {
                    await avatar.current.terminate();
                } catch (e) {
                    console.warn("Error terminating avatar:", e);
                }
                avatar.current = null;
            }
        } catch (error) {
            console.error("Error during disconnection:", error);
        } finally {
            setTimeout(() => {
                window.location.reload();
            }, 3000);
        }
    }

    // Initialize avatar session
    async function initializeAvatarSession() {
        try {
            const token = await fetchAccessToken();

            if (avatar.current) {
                avatar.current = null;
            }
            avatar.current = new StreamingAvatar({ token });

            avatar.current.on(StreamingEvents.STREAM_DISCONNECTED, () => {
                console.log("Avatar Disconnected");
                handleDisconnect();
            });
    
            avatar.current.on(StreamingEvents.STREAM_READY, (event) => {
                console.log("Avatar is ready...");
                handleStreamReady(event);
            });
    
            await avatar.current.createStartAvatar({
                quality: AvatarQuality.High,
                avatarName: 'default',
                knowledgeId: '',
                voice: {
                    rate: 1.5,
                    emotion: VoiceEmotion.FRIENDLY,
                },
                language: 'en',
                disableIdleTimeout: true,
            });
    
            if (avatar.current.mediaStream === null) {
                console.log("No video");
                handleDisconnect();
                return;
            }
    
            console.log("Video stream is active");
    
            avatar.current.on(StreamingEvents.USER_START, () => {
                console.log("Listening...");
            });
    
            avatar.current.on(StreamingEvents.USER_STOP, () => {
                console.log("Processing...");
            });
    
            avatar.current.on(StreamingEvents.AVATAR_START_TALKING, () => {
                console.log("Avatar is speaking...");
            });
    
            avatar.current.on(StreamingEvents.AVATAR_STOP_TALKING, () => {
                console.log("Waiting for user...");
            });
    
        } catch (error) {
            setMessage("Could not connect to Avatar. Try Again.");
            console.error("Avatar initialization failed:", error);
            handleDisconnect();
        }
    }

    // Handle when avatar stream is ready
    async function handleStreamReady(event) {
        try{
            avatarVideo.current.srcObject = event.detail;
            avatarVideo.current.onloadedmetadata = () => {
            avatarVideo.current.play()
            }
        }catch(error){
            console.log("Error setting up stream", error);
            setTimeout(() => {
                window.location.reload();
            }, 3000);
        }
    }

    return (
        <div className="App">
            {showEve ? (
                <>
                <video
                    ref={avatarVideo}
                    autoPlay
                    playsInline
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                }}></video>
                <div style={{ position: 'absolute', bottom: '30px', width: '100%', textAlign: 'center' }}>
                    <button ref={disconnectButtonRef} onClick={handleDisconnect}>Down to Disconnect</button>
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