const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

// Initialize the app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose
  .connect("mongodb://localhost:27017/blog", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Failed to connect to MongoDB", err);
  });

// Blog Post Model
const PostSchema = new mongoose.Schema({
  title: String,
  content: String,
  excerpt: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Post = mongoose.model("Post", PostSchema);

// Routes
app.get("/posts", async (req, res) => {
  const posts = await Post.find();
  res.json(posts);
});

app.get("/posts/:id", async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).send("Post not found");
  res.json(post);
});

app.post("/posts", async (req, res) => {
  const { title, content } = req.body;
  const post = new Post({
    title,
    content,
    excerpt: content.substring(0, 100),
  });
  await post.save();
  res.status(201).json(post);
});

app.put("/posts/:id", async (req, res) => {
  const { title, content } = req.body;
  const post = await Post.findByIdAndUpdate(
    req.params.id,
    {
      title,
      content,
      excerpt: content.substring(0, 100),
    },
    { new: true }
  );
  if (!post) return res.status(404).send("Post not found");
  res.json(post);
});

app.delete("/posts/:id", async (req, res) => {
  const post = await Post.findByIdAndDelete(req.params.id);
  if (!post) return res.status(404).send("Post not found");
  res.json({ message: "Post deleted" });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
