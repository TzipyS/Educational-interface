require('dotenv').config();
const express = require('express');
const cors = require('cors');
const corsOptions=require("./config/corsOptions")
const connectDB = require('./config/dbConn');
const { default: mongoose } = require('mongoose');
const PORT = process.env.PORT || 2500;
const seedCategories= require("./seed/categories");
const seedSubCategories= require("./seed/sub_categories");
const Categories =require("./models/Category")

const app = express();
connectDB();

app.use(cors(corsOptions));
app.use(express.json());
app.use('/api/users', require('./routes/userRoute'));
app.use('/api/prompts', require('./routes/promptRoute'));
app.use('/api/categories', require('./routes/categoryRoute'));
app.use('/api/subcategories', require('./routes/subCategoryRoute'));
app.get('/', (req, res) => {
  res.send('Hello!');
});

mongoose.connection.once('open',async()=>{
   const count = await Categories.countDocuments();
    if (count === 0) {
    await seedCategories();
    await seedSubCategories();
  }
  console.log('MongoDB Connected')
  app.listen(PORT, () => console.log(`server is running on PORT ${PORT}`))
})

mongoose.connection.on('error',err=>{
  console.log(err)
})
