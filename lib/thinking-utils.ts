/**
 * Utilities for processing AI thinking content and streaming responses
 */

export interface ThinkingParseResult {
  thinking: string;
  content: string;
}

/**
 * Extract thinking content from AI responses
 * Handles both <thinking> tags and separates clean content
 */
export function parseThinkingContent(content: string): ThinkingParseResult {
  // Extract all thinking blocks using global search with dotall behavior
  const thinkingRegex = /<thinking>([\s\S]*?)<\/thinking>/g;
  const thinkingMatches = content.match(thinkingRegex);
  
  let thinking = '';
  let cleanContent = content;
  
  if (thinkingMatches) {
    // Combine all thinking content
    thinking = thinkingMatches
      .map(match => match.replace(/<\/?thinking>/g, '').trim())
      .join(' ');
    
    // Remove all thinking blocks from main content
    cleanContent = content.replace(thinkingRegex, '').trim();
  }
  
  return {
    thinking,
    content: cleanContent
  };
}

/**
 * Escape string for safe JSON embedding
 */
export function escapeJsonString(str: string): string {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\t/g, '\\t');
}

/**
 * Split text into chunks for streaming
 */
export function splitIntoChunks(text: string, wordsPerChunk: number = 10): string[] {
  const words = text.split(' ');
  const chunks: string[] = [];
  
  for (let i = 0; i < words.length; i += wordsPerChunk) {
    const chunk = words.slice(i, i + wordsPerChunk).join(' ');
    if (chunk.trim()) {
      chunks.push(chunk + (i + wordsPerChunk < words.length ? ' ' : ''));
    }
  }
  
  return chunks;
}