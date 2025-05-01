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
            this.iframe = document.createElement('iframe')
            this.iframe.src = 'http://localhost:3000' // Make sure React is on this port
            this.iframe.style.position = 'absolute'
            this.iframe.style.top = '0px'
            this.iframe.style.left = '0px'
            this.iframe.style.width = '25%'
            this.iframe.style.height = '25%'
            this.iframe.style.zIndex = '1000'
            this.iframe.style.border = '2px, solid, black'
            document.body.appendChild(this.iframe)
        }
    }

    _handleUp() {
        console.log('Up key pressed')
    }

    _handleDown() {
        console.log('Down key pressed')
    }

    _handleEnterRelease(e) {
        console.log(e)
        console.log('Enter key pressed in Lightning app')
        this.iframe?.contentWindow?.postMessage('pressButton', '*')   
    }
}
