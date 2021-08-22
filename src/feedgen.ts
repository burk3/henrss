import { Feed } from "feed";
import { pollNewlyMinted } from "./hen";

const mkPizzaUrl = (ipfsUri: string) =>
  `https://pizza.ipfs.io/ipfs/${ipfsUri.split("/").pop()}`;

export async function genNewlyMintedFeed() {
  const objkts = await pollNewlyMinted(25);

  const updated = new Date(objkts[0].timestamp);
  const feed = new Feed({
    title: "HEN OBJKTs",
    description: "Firehose feed of Hic et Nunc OBJKTs as they are minted.",
    id: "https://henrss.herokuapp.com",
    link: "htts://henrss.herokuapp.com",
    language: "en",
    copyright: "All OBJKTs copyright their respective creators.",
    updated,
    feedLinks: {
      json: "https://henrss.herokuapp.com/newlyMinted/feed.json",
      atom: "https://henrss.herokuapp.com/newlyMinted/atom.xml",
      rss: "https://henrss.herokuapp.com/newlyMinted/feed.rss",
    },
  });

  for (const objkt of objkts) {
    const henUrl = `https://www.hicetnunc.xyz/objkt/${objkt.id}`;
    const artifactUrl = mkPizzaUrl(objkt.artifact_uri);
    const displayImgUrl = mkPizzaUrl(objkt.display_uri);
    const creatorLink = `https://www.hicetnunc.xyz/tz/${objkt.creator.address}`;

    const fancyContent = objkt.mime.startsWith("image/")
      ? {
          image: {
            url: artifactUrl,
            type: objkt.mime,
            title: objkt.title,
          },
        }
      : objkt.mime.startsWith("video/")
      ? {
          video: {
            url: artifactUrl,
            type: objkt.mime,
            title: objkt.title,
          },
        }
      : objkt.mime.startsWith("audio/")
      ? {
          audio: {
            url: artifactUrl,
            type: objkt.mime,
            title: objkt.title,
          },
        }
      : {};

    const content = `<img alt="${objkt.title}" src="${displayImgUrl}" />`;
    feed.addItem({
      title: objkt.title,
      description: objkt.description,
      content,
      link: henUrl,
      id: henUrl,
      date: new Date(objkt.timestamp),
      author: [
        {
          name: objkt.creator.name || objkt.creator.address,
          link: creatorLink,
        },
      ],
      ...fancyContent,
    });
  }

  return feed;
}
