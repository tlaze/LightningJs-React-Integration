
let socket = null

export function initializeConnection(url) {
    socket = new WebSocket(url);

    socket.onopen = () => {
        console.log('[WebSocket] Connected to:', url);
    };

    socket.onmessage = (event) => {
        console.log('[WebSocket] Message received:', event.data);
    };

    socket.onerror = (error) => {
        console.error('[WebSocket] Error:', error);
    };

    socket.onclose = () => {
        console.log('[WebSocket] Connection closed');
    };

    return socket;
}

export function closeWebsocket(sock = socket) {
    if (sock && sock.readyState === WebSocket.OPEN) {
        sock.close();
        console.log('[WebSocket] Closing connection...');
    }
}