require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require('path');
const routes = require("./routes/routes");
const PORT = process.env.PORT || 5000;
const db = process.env.MONGO_URL;
const app = express();

app.use(cors());
app.use(express.json());
app.use("/", routes);


//Connect to MongoDB
mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected..."))
  .catch(error => console.log(error));

  //Serve static assets if in production
  if(process.env.NODE_ENV === 'production'){
    app.use(express.static('client/build'));

    app.get('*', (req, res)=>{
      res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
  };  
  
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
