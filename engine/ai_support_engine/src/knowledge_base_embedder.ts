/**
 * Knowledge Base Vector Embedder & Semantic Retrieval Engine
 * High-performance chunking, cosine similarity scoring, and document indexing.
 */

export interface KnowledgeDocument {
  id: string;
  title: string;
  category: 'product_faq' | 'shipping_policy' | 'return_policy' | 'technical_spec' | 'clinical_triage';
  content: string;
  sourceUrl: string;
  metadata?: Record<string, string | number>;
}

export interface DocumentChunk {
  chunkId: string;
  documentId: string;
  title: string;
  category: string;
  text: string;
  tokenCount: number;
  embeddingVector: number[];
}

export interface RetrievalResult {
  chunk: DocumentChunk;
  similarityScore: number;
  matchRank: number;
}

export class KnowledgeBaseEmbedder {
  private chunks: DocumentChunk[] = [];
  private readonly defaultSimilarityThreshold: number = 0.72;

  constructor(threshold?: number) {
    if (threshold !== undefined) {
      this.defaultSimilarityThreshold = threshold;
    }
  }

  /**
   * Split text into overlapping token windows
   */
  public chunkText(text: string, chunkSize: number = 350, overlap: number = 50): string[] {
    const words = text.split(/\s+/).filter(w => w.length > 0);
    const result: string[] = [];
    let start = 0;

    while (start < words.length) {
      const end = Math.min(start + chunkSize, words.length);
      const chunkWords = words.slice(start, end);
      result.push(chunkWords.join(' '));
      if (end >= words.length) break;
      start += (chunkSize - overlap);
    }
    return result;
  }

  /**
   * Deterministic semantic embedding synthesizer (normalized unit vector)
   */
  public generateEmbedding(text: string, dimensions: number = 64): number[] {
    const vector = new Array(dimensions).fill(0);
    const clean = text.toLowerCase().replace(/[^a-z0-9 ]/g, '');
    const tokens = clean.split(/\s+/);

    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];
      let hash = 0;
      for (let j = 0; j < token.length; j++) {
        hash = (hash * 31 + token.charCodeAt(j)) & 0xffffffff;
      }
      const dimIndex = Math.abs(hash) % dimensions;
      vector[dimIndex] += 1.0;
    }

    // L2 Normalize to unit vector
    const norm = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
    if (norm === 0) return vector;
    return vector.map(val => val / norm);
  }

  /**
   * Ingest and index a knowledge document
   */
  public ingestDocument(doc: KnowledgeDocument): DocumentChunk[] {
    const rawChunks = this.chunkText(doc.content);
    const ingested: DocumentChunk[] = [];

    for (let i = 0; i < rawChunks.length; i++) {
      const chunkText = rawChunks[i];
      const chunk: DocumentChunk = {
        chunkId: `${doc.id}_c${i + 1}`,
        documentId: doc.id,
        title: doc.title,
        category: doc.category,
        text: chunkText,
        tokenCount: chunkText.split(/\s+/).length,
        embeddingVector: this.generateEmbedding(chunkText)
      };
      this.chunks.push(chunk);
      ingested.push(chunk);
    }
    return ingested;
  }

  /**
   * Compute Cosine Similarity between two unit vectors
   */
  public cosineSimilarity(vecA: number[], vecB: number[]): number {
    if (vecA.length !== vecB.length) return 0;
    let dotProduct = 0;
    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i];
    }
    return Math.max(0, Math.min(1, dotProduct));
  }

  /**
   * Retrieve top-K relevant chunks for query
   */
  public search(query: string, topK: number = 3, minScore?: number): RetrievalResult[] {
    const threshold = minScore !== undefined ? minScore : this.defaultSimilarityThreshold;
    const queryVector = this.generateEmbedding(query);

    const scored = this.chunks.map(chunk => ({
      chunk,
      similarityScore: this.cosineSimilarity(queryVector, chunk.embeddingVector)
    }));

    return scored
      .filter(item => item.similarityScore >= threshold)
      .sort((a, b) => b.similarityScore - a.similarityScore)
      .slice(0, topK)
      .map((item, index) => ({
        chunk: item.chunk,
        similarityScore: Math.round(item.similarityScore * 1000) / 1000,
        matchRank: index + 1
      }));
  }

  public getIndexedChunkCount(): number {
    return this.chunks.length;
  }
}
