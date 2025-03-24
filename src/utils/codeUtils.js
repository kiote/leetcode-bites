/**
 * Utility function to sanitize code input (especially from mobile devices)
 * Replaces problematic characters with their proper coding equivalents
 */
export const sanitizeCode = (code) => {
  if (!code) return '';
  
  // Create a map of problematic characters to their proper coding equivalents
  const charMap = {
    // ... existing code...
  };
  
  // Replace characters using the map
  let sanitized = code;
  for (const [problematic, replacement] of Object.entries(charMap)) {
    sanitized = sanitized.split(problematic).join(replacement);
  }
  
  // Additional generic replacements for any remaining smart quotes or similar characters
  sanitized = sanitized
    .replace(/[""]/g, '"')
    .replace(/['']/g, "'")
    .replace(/[—–]/g, '-')
    .replace(/[∶]/g, ':')
    .replace(/[；]/g, ';');
  
  return sanitized;
};
