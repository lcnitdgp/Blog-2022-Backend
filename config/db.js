require('dotenv').config()
const mongoose = require('mongoose')

const connectDB = async () => {
  console.log(process.env.MONGO_URI)
  try {
    
    await mongoose.connect(
      process.env.MONGO_URI ,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
    )

    console.log('MongoDB connection SUCCESS')
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

module.exports = {connectDB}