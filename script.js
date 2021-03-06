const canvas = document.getElementById('canvas1')
const ctx = canvas.getContext('2d')
canvas.width = window.innerWidth
canvas.height = window.innerHeight
let particleArray = []
let adjustX = 10
let adjustY = 10
let scale = 20
let spreadSpeed = 10
let particleDistance =50

//mouse 
const mouse ={
    x : null,
    y: null,
    radius: 200
}

window.addEventListener('mousemove',function(event){
    mouse.x = event.x
    mouse.y = event.y
})
ctx.fillStyle ='white'
ctx.font = '30px Verdana'
ctx.fillText('S',0,30)
const textCoordinates = ctx.getImageData(0,0,100,100)

class Particle{
    constructor(x,y){
        this.x = x
        this.y = y
        this.size = 2
        this.baseX = this.x
        this.baseY = this.y
        this.density = (Math.random()+0.1)
    }
    draw(){
        ctx.fillStyle = 'white'
        ctx.beginPath()
        ctx.arc(this.x,this.y,this.size,0,Math.PI*2)
        ctx.closePath()
        ctx.fill()
    }
    update(){
        let dx = mouse.x - this.x
        let dy = mouse.y - this.y
        let distance = Math.sqrt(dx*dx+ dy*dy)
        let forceDirectionX = dx/distance
        let forceDirectionY = dy/distance
        let maxDirection = mouse.radius
        let force = (maxDirection-distance)/maxDirection
        let diectionX = forceDirectionX *force / this.density *spreadSpeed
        let diectionY = forceDirectionY *force / this.density *spreadSpeed
        if(distance <= mouse.radius){
            this.x -= diectionX
            this.y -= diectionY
        }else{
            if(this.x !== this.baseX){
                let dx = this.x - this.baseX
                this.x -= dx/10
            }
            if(this.y !== this.baseY){
                let dy = this.y - this.baseY
                this.y -= dy/10
            }
        }
    }
}
function init(){
    particleArray = []
    for(let y=0;y<textCoordinates.height;y++){
        for(let x=0;x<textCoordinates.width;x++){
            if(textCoordinates.data[(y*4*textCoordinates.width)+(x*4)+3]>128){
                let positionX = x +adjustX
                let positionY = y + adjustY
                particleArray.push(new Particle(positionX*scale,positionY*scale))
            }
        }
    }
    
}
init()
console.log(particleArray);

function animation(){
    ctx.clearRect(0,0,canvas.width,canvas.height)
    particleArray.forEach((particle)=>{
        particle.draw()
        particle.update()
    })
    connect(mouse.x,mouse.y)
    requestAnimationFrame(animation)
}
animation()

function connect(x,y){
    let opacityValue=1
    for(let a =0;a<particleArray.length;a++){
        for(let b = a;b<particleArray.length ;b++){
            let dx = particleArray[a].x - particleArray[b].x
            let dy = particleArray[a].y - particleArray[b].y
            let distance = Math.sqrt(dx*dx+ dy*dy)
            opacityValue = 1-(distance/particleDistance)
            ctx.strokeStyle ='rgba(255,255,255,'+opacityValue+')'
            let mouseDx = particleArray[a].x-x
            let mouseDy = particleArray[a].y-y
            let mouseDistance = Math.sqrt(mouseDx*mouseDx+ mouseDy*mouseDy)
            let opacity = 1- (mouseDistance/mouse.radius)
            if(mouseDistance<mouse.radius){
                ctx.strokeStyle =`rgba(255,${255*opacity},${255*opacity},${opacityValue})`
            }


            if(distance< particleDistance){
                ctx.lineWidth = 2
                ctx.beginPath()
                ctx.moveTo(particleArray[a].x,particleArray[a].y)
                ctx.lineTo(particleArray[b].x,particleArray[b].y)
                ctx.stroke()
            }
        }
    }
}
