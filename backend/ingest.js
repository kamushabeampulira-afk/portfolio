const path = require("node:path");
const { TextLoader } = require("langchain/document_loaders/fs/text");
const { RecursiveCharacterTextSplitter } = require("langchain/text_splitter");
const { PineconeStore } = require("@langchain/pinecone");
const { Pinecone } = require("@pinecone-database/pinecone");
const LocalEmbeddings = require("./LocalEmbeddings");
require("dotenv").config();

const INDEX_NAME = "portfolio-index";
const EMBEDDING_DIMENSION = LocalEmbeddings.dimension;

async function waitForIndexReady(pinecone) {
  for (let attempt = 0; attempt < 30; attempt += 1) {
    const indexDescription = await pinecone.describeIndex(INDEX_NAME);
    if (indexDescription.status?.ready) {
      return indexDescription;
    }

    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  throw new Error(`Pinecone index "${INDEX_NAME}" did not become ready in time.`);
}

async function waitForIndexDeleted(pinecone) {
  for (let attempt = 0; attempt < 30; attempt += 1) {
    const indexes = await pinecone.listIndexes();
    const indexExists = indexes.indexes?.some(
      (index) => index.name === INDEX_NAME,
    );

    if (!indexExists) {
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  throw new Error(`Pinecone index "${INDEX_NAME}" was not deleted in time.`);
}

async function ingestData() {
  const pineconeApiKey = process.env.PINECONE_API_KEY;

  if (!pineconeApiKey) {
    throw new Error("PINECONE_API_KEY is required to ingest portfolio data.");
  }

  const pinecone = new Pinecone({ apiKey: pineconeApiKey });
  const existingIndexes = await pinecone.listIndexes();
  let indexExists = existingIndexes.indexes?.some(
    (index) => index.name === INDEX_NAME,
  );

  if (indexExists) {
    const existingIndex = await pinecone.describeIndex(INDEX_NAME);
    if (existingIndex.dimension !== EMBEDDING_DIMENSION) {
      console.log(
        `Index "${INDEX_NAME}" has dimension ${existingIndex.dimension}; deleting it to recreate with ${EMBEDDING_DIMENSION} dimensions...`,
      );
      await pinecone.deleteIndex(INDEX_NAME);
      await waitForIndexDeleted(pinecone);
      indexExists = false;
    }
  }

  if (!indexExists) {
    console.log(`Index "${INDEX_NAME}" does not exist, creating...`);
    await pinecone.createIndex({
      name: INDEX_NAME,
      dimension: EMBEDDING_DIMENSION,
      metric: "cosine",
      waitUntilReady: true,
      spec: {
        serverless: {
          cloud: "aws",
          region: "us-east-1",
        },
      },
    });
  } else {
    console.log(`Index "${INDEX_NAME}" already exists.`);
  }

  const indexDescription = await waitForIndexReady(pinecone);
  if (indexDescription.dimension !== EMBEDDING_DIMENSION) {
    throw new Error(
      `Index "${INDEX_NAME}" has dimension ${indexDescription.dimension}; ` +
        `the local embedding model requires ${EMBEDDING_DIMENSION}. Recreate the index with the correct dimension.`,
    );
  }

  const loader = new TextLoader(
    path.join(__dirname, "data", "PORTFOLIO_INFO.txt"),
  );
  const docs = await loader.load();

  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 50,
  });
  const splitDocs = await textSplitter.splitDocuments(docs);

  if (splitDocs.length === 0) {
    throw new Error("No portfolio content was found to ingest.");
  }

  const embeddings = new LocalEmbeddings();
  const pineconeIndex = pinecone.Index(INDEX_NAME);

  console.log("Ingesting data with local embeddings... please wait.");
  await PineconeStore.fromDocuments(splitDocs, embeddings, { pineconeIndex });

  console.log("Data successfully ingested into Pinecone!");
}

ingestData().catch((error) => {
  console.error("Error ingesting data:", error);
  process.exitCode = 1;
});
