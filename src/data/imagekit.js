import ImageKit from 'imagekit-javascript';

// SDK initialization
const imagekit = new ImageKit({
  publicKey: import.meta.env.PUBLIC_IMAGEKIT_PUBLIC_KEY,
  urlEndpoint: import.meta.env.PUBLIC_IMAGEKIT_URL_ENDPOINT,
  authenticationEndpoint: '/api/imagekit-auth', // Use our local API endpoint
});

export async function uploadImage(file, fileName) {
  // Explicitly fetch authentication tokens
  try {
    const authResponse = await fetch('/api/imagekit-auth');
    if (!authResponse.ok) {
      throw new Error('Failed to get authentication tokens for ImageKit');
    }
    
    const authData = await authResponse.json();
    
    return new Promise((resolve, reject) => {
      imagekit.upload({
        file: file,
        fileName: fileName,
        folder: '/game',
        useUniqueFileName: true,
        tags: ['game'],
        // Explicitly provide authentication parameters
        token: authData.token,
        signature: authData.signature,
        expire: authData.expire
      }, function(err, result) {
        if (err) {
          console.error('Error uploading image:', err);
          reject(err);
        } else {
          console.log('Upload successful:', result);
          resolve(result);
        }
      });
    });
  } catch (error) {
    console.error('Authentication error:', error);
    throw error;
  }
}

export function getOptimizedImageUrl(url) {
  if (!url) return '';
  
  // If it's an ImageKit URL, use the SDK's url method for transformations
  if (url.includes(import.meta.env.PUBLIC_IMAGEKIT_URL_ENDPOINT)) {
    return imagekit.url({
      src: url,
      transformation: [{ 
        focus: 'auto'
      }]
    });
  }
  
  // Return original URL if not from ImageKit
  return url;
}

export default imagekit;