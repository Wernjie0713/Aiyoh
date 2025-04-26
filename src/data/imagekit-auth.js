import crypto from 'crypto';

export function createSignature() {
  // Get the private key from environment variables
  const privateKey = import.meta.env.IMAGEKIT_PRIVATE_KEY;
  
  if (!privateKey) {
    throw new Error('ImageKit private key is not defined');
  }
  
  // Create token that expires in 30 minutes
  const token = crypto.randomBytes(16).toString('hex');
  const expire = Math.floor(Date.now() / 1000) + 30 * 60; // 30 minutes from now
  
  // Create signature
  const signatureData = token + expire;
  const signature = crypto.createHmac('sha1', privateKey).update(signatureData).digest('hex');
  
  return {
    token,
    expire,
    signature
  };
}