const express=require('express')
const bodyParser=require('body-parser')
const cors=require('cors')

const PORT=5000
const app=express()
const server=require('http').createServer(app)
const io=require('socket.io')(server,{
  cors:{
    origin:'*',
    method:['GET','POST']
  }
})


app.use(cors())

io.on('connection',(socket)=>{ 

  socket.emit('me',socket.id)

  socket.on('disconnect',()=>{
     console.log(`Socket ${socket.id} is disconnected...`)
     socket.broadcast.emit('callended')
  })


  socket.on('calluser',({userToCall,signalData,from,name})=>{
     io.to(userToCall).emit('calluser',{signal:signalData,from,name})
  })

  socket.on('answercall',(data)=>{
    io.to(data.to).emit('callaccepted',data.signal)
 })


})

app.get('/',(req,res)=>{
  res.send('Server is running...')
})


server.listen(PORT,()=>{
  console.log('Server is listening on PORT:',PORT)
})

