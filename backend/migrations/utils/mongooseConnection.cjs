const mongoose = require('mongoose');

let openedByThisModule = false;

async function connectWithTLS() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }
  const url = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ishaq-medical';
  await mongoose.connect(url, {
    serverSelectionTimeoutMS: 30000,
    connectTimeoutMS: 30000,
  });
  openedByThisModule = true;
  return mongoose.connection;
}

async function closeConnection() {
  if (openedByThisModule && mongoose.connection.readyState === 1) {
    await mongoose.disconnect();
    openedByThisModule = false;
  }
}

module.exports = { connectWithTLS, closeConnection };
