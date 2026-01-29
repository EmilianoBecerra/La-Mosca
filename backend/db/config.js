const { connect } = require("mongoose");

async function conectarDB () {
  try {
    const pass = encodeURIComponent(process.env.PASS);
    const uri = `mongodb+srv://admin:${pass}@blogcluster.allxcwv.mongodb.net/mosca?retryWrites=true&w=majority`;
    await connect(uri);
    console.log("MongoDB conectado correctamente");
  } catch (e) {
    console.error("Error conectando a MongoDB:", e.message);
    process.exit(1);
  }
}

module.exports = { conectarDB };
