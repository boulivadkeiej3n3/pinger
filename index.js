const Puppeteer = require("puppeteer");
const Mongoose  = require("mongoose");
const HTTP      = require("http");

const ServersDB = Mongoose.model(`Servers`, new Mongoose.Schema({url:String}));
const asyncTimeout = async(duration)=>{await new Promise((resolve)=>{setTimeout(resolve,duration)}) }
const ServersToPing = ["https://natural-smiling-goldfish.glitch.me/","https://short-substantial-dew.glitch.me/","https://mysterious-garrulous-gambler.glitch.me/","https://graceful-viridian-sunflower.glitch.me/", "https://night-sparkly-bedbug.glitch.me/"];
/*************************************************/
Mongoose.connect(`mongodb+srv://maximous:123MONGODB.com@m001.cmsqx.mongodb.net/?retryWrites=true&w=majority`).then((connection)=>{
connection ? console.log(`Database Connected!`): console.log(`Error Occured during connection to database`);
})

async function handleRequests(req,res){
  let serverURL =`https://${req.url.match(/(?<=add\/).+/)[0]}/`;
  console.log(`[REQUEST RECEIVED]:  NEW URL: ${serverURL}`);
  (new ServersDB({url:serverURL})).save();
  res.end(``);
 }
HTTP.createServer(handleRequests).listen(3000,()=>console.log("'A' Pinger Server Started Listening"))


async function main(){
  const Browser = await Puppeteer.launch({headless:true});
  const ServerPage    = await Browser.newPage();

  //Looping forever and ping all list of servers every 2 minutes:
    while(true){
        for(const ServerURL of ServersToPing)
        {
           console.log(`GOTO: ${ServerURL}`);
           try{
            (!ServerPage)?ServerPage =  await Browser.newPage():0;
           await ServerPage.goto(ServerURL)
           }catch(e){if(e){ console.log(`[PINGER ERROR]: ${e.message}`)}}
           await asyncTimeout(20000);
          
        }
           await asyncTimeout(30000)
    }
}main();


