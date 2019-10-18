const fs = require('fs');
const Koa = require('koa');

const app = new Koa();

console.log(app,'app');
app.use(ctx=>{
  fs.readFile('123.text',function(err,data){
    if(err)throw err;
    console.log(data);
    ctx.body="hello Koa";
  });
});

app.listen(3000);