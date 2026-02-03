import { connect } from "mongoose";


export async function conectarDB() {
  try {
    const uri = process.env.URI;
    await connect(String(uri));
    console.log("MongoDB conectado correctamente");
  } catch (error) {
    console.error("Error conectando a MongoDB:", error);
    process.exit(1);
  }
}
