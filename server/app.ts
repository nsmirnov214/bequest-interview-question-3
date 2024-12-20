import express from "express";
import cors from "cors";

const PORT = 8080;
const app = express();
let database = { data: "Hello World", hash: "" };

app.use(cors());
app.use(express.json());

// Utility function to generate a hash
const generateHash = (data: string) => {
  return require("crypto").createHash("sha256").update(data).digest("hex");
};

// Initialize hash for default data
database.hash = generateHash(database.data);

// Routes

app.get("/", (req, res) => {
  res.json(database);
});

app.post("/", (req, res) => {
  const { data, hash } = req.body;
  const computedHash = generateHash(data);

  if (hash !== computedHash) {
    return res.status(400).json({ error: "Hash mismatch. Data integrity compromised." });
  }

  database = { data, hash };
  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
