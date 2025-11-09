import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

interface CacheEntry { response: string; timestamp: number; tokens: number; }

class ResponseCache {
  private cache = new Map<string, CacheEntry>();
  private TTL = 300000; // 5 min

  hash(input: string): string {
    let h = 0;
    for (let i = 0; i < input.length; i++) h = ((h << 5) - h) + input.charCodeAt(i) | 0;
    return h.toString(36);
  }

  get(prompt: string): string | null {
    const entry = this.cache.get(this.hash(prompt));
    if (!entry || Date.now() - entry.timestamp > this.TTL) return null;
    return entry.response;
  }

  set(prompt: string, response: string, tokens: number): void {
    if (this.cache.size >= 100) {
      const oldest = [...this.cache.entries()].sort((a, b) => a[1].timestamp - b[1].timestamp)[0];
      this.cache.delete(oldest[0]);
    }
    this.cache.set(this.hash(prompt), { response, timestamp: Date.now(), tokens });
  }
}

class RateLimiter {
  private requests: number[] = [];
  private limit = 50;

  check(): { allowed: boolean; remaining: number } {
    this.requests = this.requests.filter(t => Date.now() - t < 60000);
    const allowed = this.requests.length < this.limit;
    if (allowed) this.requests.push(Date.now());
    return { allowed, remaining: this.limit - this.requests.length };
  }
}

const cache = new ResponseCache();
const limiter = new RateLimiter();

export async function callClaude(
  prompt: string,
  options: { system?: string; maxTokens?: number; temp?: number; useCache?: boolean } = {}
): Promise<{ text: string; fromCache: boolean; tokens: number }> {

  // Check cache
  if (options.useCache !== false) {
    const cached = cache.get(prompt);
    if (cached) return { text: cached, fromCache: true, tokens: 0 };
  }

  // Rate limit
  const rate = limiter.check();
  if (!rate.allowed) throw new Error(`Rate limit: ${rate.remaining} requests remaining`);

  // Call API
  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: options.maxTokens || 2048,
    temperature: options.temp || 0.7,
    system: options.system || 'You are a DeFi strategy analyst.',
    messages: [{ role: 'user', content: prompt }]
  });

  const text = response.content[0].type === 'text' ? response.content[0].text : '';
  const tokens = response.usage.output_tokens;

  // Cache
  if (options.useCache !== false) cache.set(prompt, text, tokens);

  return { text, fromCache: false, tokens };
}

// Batch processing
export async function batchClaude(
  items: Array<{ prompt: string; options?: any }>,
  delayMs = 100
): Promise<Array<{ text: string; error?: string }>> {
  const results = [];
  for (const item of items) {
    try {
      const result = await callClaude(item.prompt, item.options);
      results.push({ text: result.text });
      if (delayMs > 0) await new Promise(r => setTimeout(r, delayMs));
    } catch (error: any) {
      results.push({ text: '', error: error.message });
    }
  }
  return results;
}
