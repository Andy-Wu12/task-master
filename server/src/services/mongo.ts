import mongoose from "mongoose";

mongoose.connection.on('open', () => {
  // console.log('MongoDB connection ready!');
});

mongoose.connection.on('error', (err) => {
  // console.log(err);
});

async function mongoConnect(mongoURI: string, dbName: string) {
  await mongoose.connect(mongoURI, {
    dbName: dbName
  });
}

async function mongoDisconnect() {
  await mongoose.disconnect();
}

export {
  mongoConnect,
  mongoDisconnect
}