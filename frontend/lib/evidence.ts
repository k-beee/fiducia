const SUPPORTED_PATTERNS = [
  /^https?:\/\/raw\.githubusercontent\.com\//i,
  /^https?:\/\/gist\.githubusercontent\.com\//i,
  /^https?:\/\/en\.wikipedia\.org\//i,
  /^https?:\/\/arxiv\.org\//i,
  /^https?:\/\/gist\.github\.com\//i,
  /^https?:\/\/github\.com\/.*\/blob\/.*\?raw=true/i
];

const BLOCKED_PATTERNS = [
  /twitter\.com/i,
  /x\.com/i,
  /mirror\.xyz/i,
  /linkedin\.com/i,
  /etherscan\.io/i,
  /facebook\.com/i,
  /instagram\.com/i
];

export function preflightUrl(url: string): { status: 'supported' | 'unsupported' | 'blocked'; note: string } {
  const trimmed = url.trim();
  if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://")) {
    return { status: 'unsupported', note: 'URL must start with http:// or https://' };
  }
  for (const pattern of BLOCKED_PATTERNS) {
    if (pattern.test(trimmed)) {
      return { status: 'blocked', note: 'Validators cannot render auth-gated/JS-heavy/social media pages' };
    }
  }
  for (const pattern of SUPPORTED_PATTERNS) {
    if (pattern.test(trimmed)) {
      return { status: 'supported', note: 'Optimal for text-rendering consensus' };
    }
  }
  return { status: 'unsupported', note: 'Might work if plain HTML; avoid JS-heavy dynamic rendering' };
}
