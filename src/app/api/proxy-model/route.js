// Proxy TensorFlow model requests and bypass CORS
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const modelUrl = searchParams.get('url');

  if (!modelUrl) {
    return new Response('Missing URL parameter', { status: 400 });
  }

  try {
    console.log('Proxying request for:', modelUrl);
    
    const response = await fetch(modelUrl, {
      headers: {
        'Accept': 'application/json, application/octet-stream, */*',
        'User-Agent': 'Mozilla/5.0 (compatible; TensorFlow.js)',
      },
      redirect: 'follow',
    });

    if (!response.ok) {
      console.error('Proxy fetch failed:', response.status, response.statusText);
      throw new Error(`Failed to fetch: ${response.statusText}`);
    }

    const data = await response.arrayBuffer();
    const contentType = response.headers.get('content-type') || 'application/octet-stream';

    console.log('Successfully proxied:', modelUrl, 'Content-Type:', contentType);

    return new Response(data, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Proxy error:', error);
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      }
    });
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}