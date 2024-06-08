export default async (cleartext: string) => {
  // Encode the input string as UTF-8
  const encoder = new TextEncoder();
  const data = encoder.encode(cleartext);

  // Generate a SHA-256 hash of the input
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);

  // Convert the hash to a hex string
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');

  // Truncate the hash to the first 16 characters (64 bits)
  const truncatedHash = hashHex.substring(0, 64);

  return truncatedHash;  
}
