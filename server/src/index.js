/*
const startServerApp = require("./server")
const cluster = require("cluster")
const os = require("os")


const numCPUs = os.cpus().length

if(cluster.isMaster){
  for(let i=0;i<numCPUs;++i){
    cluster.fork() 
  }
  
}
else{
    startServerApp()
}

cluster.on("exit",()=>{
  cluster.fork()
})
*/