import redis
import json
import time
import fitz  # PyMuPDF
import uuid

from sentence_transformers import SentenceTransformer
from qdrant_client import QdrantClient
from qdrant_client.models import PointStruct, VectorParams, Distance

# ---- CONFIG ----
REDIS_QUEUE_NAME = "bull:file-upload-queue"
QDRANT_HOST = "localhost"
QDRANT_PORT = 6333

QDRANT_COLLECTION = "pdf-embeddings"
VECTOR_SIZE = 768  # bge-base-en-v1.5 output size
CHUNK_SIZE = 1000
CHUNK_OVERLAP = 200

# ---- INIT ----
print("🔧 Connecting to Redis...")
r = redis.Redis(host='localhost', port=6379, db=0)

print("🧠 Loading embedding model (bge-base-en-v1.5)...")
model = SentenceTransformer("BAAI/bge-base-en-v1.5")

print("📦 Connecting to Qdrant...")
qdrant = QdrantClient(host=QDRANT_HOST, port=QDRANT_PORT)

# Create Qdrant collection if it doesn't exist
if QDRANT_COLLECTION not in [c.name for c in qdrant.get_collections().collections]:
    qdrant.recreate_collection(
        collection_name=QDRANT_COLLECTION,
        vectors_config=VectorParams(size=VECTOR_SIZE, distance=Distance.COSINE)
    )
    print(f"✅ Created collection: {QDRANT_COLLECTION}")


def extract_chunks(pdf_path: str, chunk_size=CHUNK_SIZE, overlap=CHUNK_OVERLAP):
    print(f"📄 Reading PDF: {pdf_path}")
    doc = fitz.open(pdf_path)
    text = "\n".join(page.get_text() for page in doc)

    chunks = []
    start = 0
    while start < len(text):
        end = min(start + chunk_size, len(text))
        chunks.append(text[start:end])
        start += chunk_size - overlap
    print(f"🔹 Extracted {len(chunks)} chunks.")
    return chunks


print("🚀 Worker is running. Waiting for jobs...")

# ---- POLL LOOP ----
while True:
    try:
        job_data = r.lpop(REDIS_QUEUE_NAME)

        if job_data:
            job = json.loads(job_data.decode("utf-8"))
            print(f"\n📦 Received job: {job}")
            pdf_path = job["path"]

            chunks = extract_chunks(pdf_path)
            embeddings = model.encode(chunks).tolist()

            points = [
                PointStruct(
                    id=str(uuid.uuid4()),
                    vector=vec,
                    payload={
                        "text": chunks[i],
                        "source": pdf_path,
                    }
                )
                for i, vec in enumerate(embeddings)
            ]

            qdrant.upsert(collection_name=QDRANT_COLLECTION, points=points)
            print(f"✅ Uploaded {len(points)} vectors to Qdrant.")

        time.sleep(1)

    except Exception as e:
        print("❌ Worker error:", e)
        time.sleep(3)
