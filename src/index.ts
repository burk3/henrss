import compression from 'compression';
import express from "express";

import { genNewlyMintedFeed } from "./feedgen";

const port = 3000;

const app = express();

app.use(compression());

app.get("/feed.rss", async (req, res) => {
  const feed = await genNewlyMintedFeed();
  res.set("Content-Type", "application/rss+xml");
  res.send(feed.rss2());
});

app.get("/atom.xml", async (req, res) => {
  const feed = await genNewlyMintedFeed();
  res.set("Content-Type", "application/atom+xml");
  res.send(feed.atom1());
});

app.get("/feed.json", async (req, res) => {
  const feed = await genNewlyMintedFeed();
  res.set("Content-Type", "application/json");
  res.send(feed.json1());
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
