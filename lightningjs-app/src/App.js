import { Lightning, Utils } from '@lightningjs/sdk'

export default class App extends Lightning.Component {
    static getFonts() {
        return [{ family: 'Regular', url: Utils.asset('fonts/Roboto-Regular.ttf') }]
    }

    static _template() {
        return {
            Background: {
                w: 1920,
                h: 1080,
            },
            LightningAppText: {
                x: 960,
                y: 540, 
                mount: 0.5, 
                text: {
                    text: 'Lightning App',
                    fontSize: 80,
                    textColor: 0xff000000,
                }
            }
        }
    }

    _init() {
        if (typeof window !== 'undefined') {
            this.iframe = document.createElement('iframe');
            this.iframe.src = 'http://localhost:3000';
    
            const size = 400;
    
            this.iframe.style.position = 'absolute';
            this.iframe.style.left = `${1920 - size - 40}px`;
            this.iframe.style.top = `${1080 - size - 40}px`;
    
            this.iframe.style.width = `${size}px`;
            this.iframe.style.height = `${size}px`;
            this.iframe.style.borderRadius = '50%';
            this.iframe.style.border = '2px solid black';
            this.iframe.style.overflow = 'hidden';
            this.iframe.style.zIndex = '1000';
    
            document.body.appendChild(this.iframe);
        }
    }

    _handleUpRelease(e) {
        console.log('Up key pressed in lightning app')
        this.iframe?.contentWindow?.postMessage('Connect', '*') 
    }

    _handleDownRelease(e) {
        console.log('Down key pressed in lightning app')
        this.iframe?.contentWindow?.postMessage('Disconnect', '*') 
    }

    _handleEnterRelease(e) {
        console.log(e)
        console.log('Enter key pressed in Lightning app') 
    }
}