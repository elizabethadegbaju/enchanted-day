const CHAT_FUNCTION_URL = 'https://hernhoqiybuiqii5mdbanjfk7i0phxft.lambda-url.eu-central-1.on.aws/';

async function debugStreamingResponse() {
  try {
    const payload = {
      prompt: "Create a simple test response with thinking blocks: <thinking>This is my thinking process</thinking>Here is the main response content.",
      type: 'chat',
      stream: true,
      context: { debug: true }
    };

    console.log('🐛 Debug Streaming Response...');
    console.log('📝 Prompt:', payload.prompt);
    console.log('🔄 Requesting stream...\n');

    const response = await fetch(CHAT_FUNCTION_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    console.log('✅ Raw response received');
    console.log('📡 Content-Type:', response.headers.get('content-type'));
    console.log('🔄 Raw stream content:\n');

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let eventCount = 0;

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.trim()) {
            eventCount++;
            console.log(`[${eventCount}] ${line}`);
          }
        }
      }
    } finally {
      reader.releaseLock();
    }

    console.log(`\n📊 Total lines: ${eventCount}`);
    
  } catch (error) {
    console.error('❌ Debug failed:', error);
  }
}

// Run the debug
debugStreamingResponse();