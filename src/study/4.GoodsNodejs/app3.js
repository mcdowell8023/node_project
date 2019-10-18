const fs = require('fs');
const Koa = require('Koa');

const app = new Koa();

app.use(ctx=>{
  if(ctx.path=='/good'){
    return ctx.body="good";
  }

  fs.readFile('123.txt',function(err,data){
    try {
      if(err) throw err;
      console.log(data,'data');
      ctx.body="hello Koa ";
    } catch (error) {
      // 这里捕获不到 readCallback 函数抛出的异常
      console.log(error,'这里报错了')
    } finally {
      console.log('离开try/catch')
    }
    
  })
})

// 捕获 进程中的 uncaughtException 异常
process.on('uncaughtException',function(err){
  console.log(err,'err')
})

app.listen(3000)