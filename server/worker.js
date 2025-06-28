import { Worker } from "bullmq";
import { OpenAIEmbeddings } from "@langchain/openai";
import { QdrantVectorStore } from "@langchain/qdrant";
import { Document } from "@langchain/core/documents";
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { CharacterTextSplitter } from '@langchain/textsplitters';
import dotenv from "dotenv"

dotenv.config({});

const OPENAI_API = process.env.OPENAI_API
// console.log(OPENAI_API);


// const worker = new Worker(
//   'file-upload-queue',
//   async (job) => {
//     console.log(`Job:`, job.data);
//     const data = JSON.parse(job.data);
//     /*
//     Path: data.path
//     read the pdf from path,
//     chunk the pdf,
//     call the openai embedding model for every chunk,
//     store the chunk in qdrant db
//     */

//     // Load the PDF
//     const loader = new PDFLoader(data.path);
//     const docs = await loader.load();

//     const embeddings = new OpenAIEmbeddings({
//       model: 'text-embedding-3-small',
//       apiKey: OPENAI_API,
//     });

//     const vectorStore = await QdrantVectorStore.fromExistingCollection(
//       embeddings,
//       {
//         url: 'http://localhost:6333',
//         collectionName: 'pdf-embeddings',
//       }
//     );
//     await vectorStore.addDocuments(docs);
//     console.log(`All docs are added to vector store`);
//   },
//   {
//     concurrency: 100,
//     connection: {
//       host: 'localhost',
//       port: '6379',
//     },
//   }
// );

const worker = new Worker(
  'file-upload-queue',
  async (job) => {
    try {
      console.log(`Job:`, job.data);
      const data = JSON.parse(job.data);

      const loader = new PDFLoader(data.path);
      const docs = await loader.load();

      console.log("Loaded docs:", docs.length);

      const splitter = new CharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
      });

      const splitDocs = await splitter.splitDocuments(docs);
      console.log("Split docs:", splitDocs.length);

      const embeddings = new OpenAIEmbeddings({
        model: 'text-embedding-3-small',
        apiKey: OPENAI_API,
      });

      const vectorStore = await QdrantVectorStore.fromExistingCollection(
        embeddings,
        {
          url: 'http://localhost:6333',
          collectionName: 'pdf-embeddings',
        }
      );

      await vectorStore.addDocuments(splitDocs);
      console.log(`All docs are added to vector store`);

    } catch (err) {
      console.error("Error in worker:", err);
    }
  },
  {
    concurrency: 100,
    connection: {
      host: 'localhost',
      port: 6379,
    },
  }
);
