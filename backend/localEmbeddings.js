const { pipeline } = require('@huggingface/transformers');

class LocalEmbeddings {
  constructor() {
    this.extractor = null;
  }

  async initialize() {
    if (!this.extractor) {
      // Using a small model, 384 dimensions, fast download
      this.extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
    }
  }

  async embedDocuments(texts) {
    await this.initialize();
    const results = [];
    for (const text of texts) {
      const output = await this.extractor(text, { pooling: 'mean', normalize: true });
      results.push(Array.from(output.data));
    }
    return results;
  }

  async embedQuery(text) {
    const results = await this.embedDocuments([text]);
    return results[0];
  }
}

LocalEmbeddings.dimension = 384;

module.exports = LocalEmbeddings;