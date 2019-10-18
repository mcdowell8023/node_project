const fs = require('fs');
const Koa = require('Koa');

const app = new Koa();

app.use(cxt=>{
  fs.readFile('123.txt',(err,data)=>{
    if(err) throw err;
    console.log(data,'data');
    cxt.body="hello Koa ";
  })
})

// 捕获 进程中的 uncaughtException 异常
process.on('uncaughtException',function(err){
  console.log(err,'err')
})

app.listen(3000)