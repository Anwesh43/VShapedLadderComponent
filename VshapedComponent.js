const w = window.innerWidth, h = window.innerHeight, size = Math.min(w,h)/3
class VShapedComponent extends HTMLElement {
    constructor() {
        super()
        this.img = document.createElement('img')
        const shadow = this.attachShadow({mode:'open'})
        shadow.appendChild(this.img)
        this.animator = new Animator()
        this.vShaped = new VShaped()
    }
    render() {
        const canvas = document.createElement('canvas')
        canvas.width = size
        canvas.height = size
        const context = canvas.getContext('2d')
        context.fillStyle = '#212121'
        context.fillRect(0,0,size,size)
        this.vShaped.draw(context)
        this.img.src = canvas.toDataURL()
    }
    connectedCallback() {
        this.render()
        this.img.onmousedown = () => {
            this.vShaped.startUpdating(() => {
                this.animator.start(() => {
                    this.render()
                    this.vShaped.update(() => {
                        this.animator.stop()
                    })
                })
            })
        }
    }
}
class VShaped {
    constructor() {
        this.state = new VShapedState()
    }
    draw(context) {
        context.save()
        context.translate(size/2,3*size/4)
        context.lineWidth = size/20
        context.lineCap = 'round'
        context.strokeStyle = '#2ecc71'
        for(var i=0; i<2; i++) {
            context.save()
            context.save()
            context.rotate((Math.PI/6)*this.state.scales[0])
            context.beginPath()
            context.moveTo(0,0)
            context.lineTo(0,-size/2)
            context.stroke()
            context.restore()
            for(var j = 0; j<5 ;j++) {
                context.save()
                const x = ((j+1)*size/10)*this.state.scales[j+1]*Math.cos((i*2 - 1)*Math.PI/6 - Math.PI/2)
                const y = ((j+1)*size/10)*Math.sin((i*2 - 1)*Math.PI/6 - Math.PI/2)
                context.bginPath()
                context.moveTo(0,y)
                context.lineTo(x,y)
                context.stroke()
                context.restore()
            }
            context.restore()
        }
        context.restore()
    }
    update(stopcb) {
        this.state.update(stopcb)
    }
    startUpdating(startcb) {
        this.state.startUpdating(startcb)
    }
}
class VShapedState {
    constructor() {
        this.scales = [0,0,0,0,0,0]
        this.dir = 0
        this.prevScale = 0
        this.j = 0
        this.jDir = 1
    }
    update(stopcb) {
        this.scales[this.j] += 0.1*this.dir
        if(Math.abs(this.scales[this.j] - this.prevScale) > 1) {
            this.scales[this.j] = this.prevScale + this.dir
            this.dir = 0
            this.prevScale = this.scales[this.j]
            this.j += this.jDir
            if(this.j == this.scales.length || this.j  == -1) {
                this.jDir *= -1
                this.j += this.jDir
                this.prevScale = this.scales[this.j]
            }
            stopcb()
        }
    }
    startUpdating(startcb) {
        if(this.dir == 0) {
            this.dir = 1 - 2*this.prevScale
            startcb()
        }
    }
}
class Animator {
    constructor() {
        this.animated = false
    }
    start(updatecb) {
        if(!this.animated) {
            this.animated = true
            this.interval = setInterval(()=>{
                updatecb()
            },50)
        }
    }
    stop() {
        if(this.animated) {
            this.animated = false
            clearInterval(this.interval)
        }
    }
}
customElements.define('v-shaped-comp',VShapedComponent)
