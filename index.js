const express=require("express");
const app=express();
const path=require("path");
const mongoose=require("mongoose");
const ejsmate=require("ejs-mate");
const methodOverride=require("method-override");
const session=require("express-session");
const Worker=require("./models/workers.js");
const Trip=require("./models/trips.js");
const expresserror=require("./utils/expresserror");



app.engine("ejs",ejsmate)
app.set("view engine","ejs")
app.set("views",path.join(__dirname,"views"))

const sessionconfiguration={
    secret:"oooh boy",
    resave:false,
    saveUnitialized:true,
    cookie:{
        httpOnly:true,
        expires: Date.now()+1000*60*60*24*7,
        maxAge:1000*60*60*24*7
    }
}

app.use(express.urlencoded({extended: true}))
app.use(methodOverride("_method"));
app.use(session(sessionconfiguration));
app.use(express.static(path.join(__dirname,"public")))

mongoose.connect('mongodb+srv://sreeman:saiveer2k4@cluster0.mjzapfc.mongodb.net/?retryWrites=true&w=majority',{useNewUrlParser:true,useUnifiedTopology:true})

 .then(()=>{
    console.log("mongo connection open");
})
.catch(err=>{
    console.log("error");
    console.log(err);
})


app.get("/",(req,res)=>{
    res.send("lest start");
})

app.get("/workers",async (req,res)=>{
    const workers=await Worker.find({});
    res.render("workers/show.ejs",{workers});
})

app.get("/workers/add",(req,res)=>{
    res.render("workers/new.ejs");
})

app.get("/workers/:id",async (req,res)=>{
    const {id}=req.params;
    const worker=await Worker.findById(id).populate("trips");
   // res.send(worker);
   res.render("workers/info.ejs",{worker});
})
app.post("/workers",async(req,res)=>{
   const worker=new Worker(req.body);
   const trip=new Trip(req.body.trip);
   worker.totdebit=req.body.trip.debit;
   worker.totcredit=req.body.trip.credit;
   worker.balance=worker.totdebit-worker.totcredit;
   worker.trips.push(trip);
    await worker.save();
    await trip.save();
    const workers=await Worker.find({})
    res.render("workers/show.ejs",{workers});
})

app.get("/workers/:id/addtrip",async(req,res)=>{
    const {id}=req.params;
    const worker=await Worker.findById(id);
    res.render("trips/new.ejs",{worker});
})
app.post("/workers/:id",async(req,res)=>{
    const {id}=req.params;
    const trip=new Trip(req.body.trip);
    const worker=await Worker.findById(id);
    worker.totdebit=worker.totdebit+trip.debit;
    worker.totcredit=worker.totcredit+trip.credit;
    worker.balance=worker.totdebit-worker.totcredit;
    worker.trips.push(trip);
    await worker.save();
    await trip.save();
    res.redirect(`/workers/${worker._id}`);
})

app.get("/workers/:id/delete",async(req,res)=>{
    const {id}=req.params;
    const worker=await Worker.findById(id);
    res.render("conformations/delete.ejs",{worker});
})

app.get("/workers/:id/:tripid",async(req,res)=>{
    const {id,tripid}=req.params;
    const trip=await Trip.findById(tripid);
    const worker=await Worker.findById(id);
    res.render("trips/edit.ejs",{worker,trip});

})

app.put("/workers/:id/:tripid",async(req,res)=>{
    const {id,tripid}=req.params;
    const worker=await Worker.findById(id);
    const tour=await Trip.findById(tripid);
     worker.totdebit=worker.totdebit-tour.debit;
     worker.totcredit=worker.totcredit-tour.credit;
     worker.balance=worker.totdebit-worker.totcredit;
     await worker.save();
     const trip=await Trip.findByIdAndUpdate(tripid,req.body.trip,{runValidators:true,new:true});
     worker.totdebit=worker.totdebit+parseInt(req.body.trip.debit);
     worker.totcredit=worker.totcredit+parseInt(req.body.trip.credit);
     worker.balance=worker.totdebit-worker.totcredit;
     await trip.save();
     await worker.save();
     res.redirect(`/workers/${worker._id}`);
})


app.delete("/workers/:id",async(req,res)=>{
    const {id}=req.params;
    const worker=await Worker.findById(id);
    const result=await Worker.deleteOne(worker);
    res.redirect(`/workers`);
})

app.all("*",(req,res,next)=>{
    next(new expresserror("page not found",404))
})
app.use((err,req,res,next)=>{
    const {statuscode=500}=err;
    if(!err.message)err.message="oh its wrong"
    const{status=500,message="something went wrong"}=err;
    res.status(status).render("error",{err});
})

app.listen(3000,()=>{
    console.log("moviez activated on 3000")
})
