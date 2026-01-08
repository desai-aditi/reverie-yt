export function useChatMemory(messages: any[]) {
    const stripCodeFences = (str: string) => {
        // Remove fenced code blocks ```json
        let out = str.replace(/```(?:json)?\s*([\s\S]*?)```/g, '$1');
        // Remove inline backticks
        out = out.replace(/`([^`]+)`/g, '$1');
        return out;
    };

    const parseMemoryData = (text: string) => {
        if (!text) return null;
        // Strip code fences first so JSON inside ``` is parsed correctly
        const cleaned = stripCodeFences(text);
        // Match a JSON object after the MEMORY_DATA: label, allowing multiline
        const match = cleaned.match(/MEMORY_DATA:\s*({[\s\S]*?})/);
        if (!match) return null;

        const raw = match[1].trim();
        try {
            const parsed: any = JSON.parse(raw);

            // Support both `text` (preferred) and legacy `memoryText` keys
            const textField = parsed.text ?? parsed.memoryText ?? null;
            if (!textField || typeof textField !== 'string' || !textField.trim()) return null;

            const category = parsed.category ?? 'general';
            const people = Array.isArray(parsed.people) ? parsed.people : (parsed.people ? [parsed.people] : []);

            return {
                text: textField.trim(),
                category,
                title: parsed.title ?? null,
                people,
                isContinuation: Boolean(parsed.isContinuation),
                parentMemoryId: parsed.parentMemoryId ?? null,
                embedding: parsed.embedding ?? undefined,
                location: parsed.location ?? null,
                dateOfMemory: parsed.dateOfMemory ?? null,
            };
        } catch (e) {
            console.error('Failed to parse MEMORY_DATA JSON:', e, raw);
            return null;
        }
    }

    const stripMemoryData = (text: string) => {
        if (!text) return text;
        const cleaned = stripCodeFences(text);
        return cleaned.split('MEMORY_DATA:')[0].trim();
    };

    return { parseMemoryData, stripMemoryData };
}