const canvas = document.getElementById('canvas1')
const ctx = canvas.getContext('2d')
canvas.width = window.innerWidth
canvas.height = window.innerHeight
let particleArray = []
let adjustX = 10
let adjustY = 10

//mouse 
const mouse ={
    x : null,
    y: null,
    radius: 150
}

window.addEventListener('mousemove',function(event){
    mouse.x = event.x
    mouse.y = event.y
})
ctx.fillStyle ='white'
ctx.font = '40px Verdana'
ctx.fillText('Shushuno',0,50)
const textCoordinates = ctx.getImageData(0,0,200,400)

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
        let diectionX = forceDirectionX *force / this.density *1.5
        let diectionY = forceDirectionY *force / this.density *1.5
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
                particleArray.push(new Particle(positionX*10,positionY*10))
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
    requestAnimationFrame(animation)
}
animation()
