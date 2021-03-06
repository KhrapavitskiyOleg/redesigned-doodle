const path = require("path");
const express = require("express");
const mongoose = require("mongoose");

const db = require("./db/db");
const header_middleware = require("./middlewares/header");
const postRouter = require("./Routes/post");
const userRoutes = require("./Routes/user");
const profileRoutes = require("./Routes/profile");
const adminRoutes = require("./Routes/admin");

const postNoVerRoutes = require("./Routes/postNoVer");
const userNoVerRoutes = require("./Routes/userNoVer");

const { contentPost, contentUser } = require("./middlewares/modelHeaders");

const app = express();

const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(header_middleware);
app.use("/api/posts", contentPost);
app.use("/api/user", contentUser);
app.use("/api/nover/posts", contentPost);
app.use("/api/nover/user", contentUser);

const directory = path.join(__dirname, "./images");
app.use("/images", express.static(directory));

app.use("/api/nover/user", userNoVerRoutes);
app.use("/api/nover/posts", postNoVerRoutes);

app.use("/api/posts", postRouter);
app.use("/api/user", userRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/admin", adminRoutes);

app.get("/test", (req, res) => {
  res.send("Hello World!");
});

app.get("/", (req, res) => {
  res.send(
    "<pre>Hey buddy, I think you've got the wrong Route, the end user's club's two links down.\n<br><b>Fuck♂You♂</b>\nOh, Fuck♂You end user. Maybe you and I should settle it right here on the ring if you think your so tough.\nOh yea? I'll kick your ass!\nHa! Yeah right man. Let's go! Why don't you get out of that user stuff? I'll strip down out of this and we'll settle it right here in the ring. What do you say?\nYeah, no problem buddy!\nYou got it. Get out of that uh, webmaster.\nYeah, smart ass.\nI'll show you who's the boss of this host.</pre>"
  );
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
