export const GET = async () => {
  // Get the private key from environment variables
  const privateKey = import.meta.env.IMAGEKIT_PRIVATE_KEY;
  
  if (!privateKey) {
    return new Response(JSON.stringify({ error: 'ImageKit private key is not defined' }), {
      status: 500,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
  
  try {
    // Import the crypto module to generate a UUID v4
    const crypto = await import('crypto');
    
    // Generate a UUID v4 for the token
    // This ensures a truly unique token for each request
    function uuidv4() {
      return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
        (c ^ crypto.randomBytes(1)[0] & 15 >> c / 4).toString(16)
      );
    }
    
    const token = uuidv4();
    
    // Set expiration time (10 minutes from now)
    const expire = Math.floor(Date.now() / 1000) + 10 * 60;
    
    // Create signature
    const hmac = crypto.createHmac('sha1', privateKey);
    const signatureData = token + expire;
    const signature = hmac.update(signatureData).digest('hex');
    
    // Return the authentication parameters
    return new Response(JSON.stringify({
      token,
      expire,
      signature
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    });
  } catch (error) {
    console.error('Error generating ImageKit auth tokens:', error);
    return new Response(JSON.stringify({ error: 'Failed to generate authentication tokens' }), {
      status: 500,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
}