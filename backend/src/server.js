import express from "express";

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 8080;

app.get("/IT", (req, res) => {
  console.log(req.body);
  //res.header({"Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "*", "Access-Control-Allow-Headers": "Content-Type"})
  res.send("Hello IT biztonsag házi!");
}); 

app.listen(PORT, console.log(`Server started on port ${PORT}`));
