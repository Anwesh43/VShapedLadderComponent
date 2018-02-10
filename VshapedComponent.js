const w = window.innerWidth, h = window.innerHeight, size = Math.min(w,h)/3
class VShapedComponent extends HTMLElement {
    constructor() {
        super()
        this.img = document.createElement('img')
        const shadow = this.attachShadow({mode:'open'})
        shadow.appendChild(this.img)
    }
    render() {
        const canvas = document.createElement('canvas')
        canvas.width = w
        canvas.height = h
        const context = canvas.getContext('2d')
        this.img.src = canvas.toDataURL()
    }
    connectedCallback() {
        this.render()
    }
}
class VShaped {
    constructor() {

    }
    draw(context) {
        context.save()
        context.translate(size/2,3*size/4)
        context.rotate((Math.PI/6))
        context.lineWidth = size/20
        context.lineCap = 'round'
        context.strokeStyle = '#2ecc71'
        for(var i=0; i<2; i++) {
            context.save()
            context.scale(1-2*i,1)
            context.beginPath()
            context.moveTo(0,0)
            context.lineTo(0,-size/2)
            context.stroke()
            for(var j = 0; j<5 ;j++) {
                context.save()
                const x = ((j+1)*size/10)*Math.cos((i*2 - 1)*Math.PI/6)
                const y = ((j+1)*size/10)*Math.sin((i*2 - 1)*Math.PI/6)
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

    }
    startUpdating(startcb) {

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
