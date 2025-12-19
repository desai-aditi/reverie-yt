export function useChatMemory(messages: any[]) {
    const parseMemoryData = (text: string) => {
        const match = text.match(/MEMORY_DATA:\s(\{.*\})/);
        if (!match) return null;
        try {
            return JSON.parse(match[1]);
        } catch {
            return null;
        }
    }

    const stripMemoryData = (text: string) => text.split('MEMORY_DATA:')[0].trim();

    const last = messages[messages.length - 1];
    const pendingMemory = last?.role === 'assistant' ? parseMemoryData(last.parts.map((p: any) => p.text).join('')) : null;

    return { pendingMemory, stripMemoryData };
}