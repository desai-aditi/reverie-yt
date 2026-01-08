import { google } from '@ai-sdk/google';
import { createClient } from '@supabase/supabase-js';
import { embed, generateText } from 'ai';
import { z } from 'zod';
import { supabase } from '../../lib/supabase';

/* -----------------------------------
   Constants & Schema
----------------------------------- */

const VALID_CATEGORIES = [
  'general',
  'personal',
  'work',
  'idea',
  'todo',
  'health',
  'finance',
  'learning',
  'travel',
  'food',
] as const;

const SaveMemorySchema = z.object({
  text: z.string().min(1).max(5000),
  category: z.enum(VALID_CATEGORIES).default('general'),
  title: z.string().min(1).max(200).optional(),
  people: z.array(z.string()).default([]),
  location: z.string().nullable().default(null),
  dateOfMemory: z.string().nullable().default(null),
  isContinuation: z.boolean().default(false),
  parentMemoryId: z.string().uuid().nullable().default(null),
});

/* -----------------------------------
   People Helpers
----------------------------------- */

async function getOrCreatePeople(names: string[]) {
  if (!names.length) return [];

  const normalized = names.map(n => n.trim().toLowerCase());
  const people = [];

  for (const name of normalized) {
    const { data } = await supabase
      .from('people')
      .upsert({ name }, { onConflict: 'name' })
      .select()
      .single();

    if (data) people.push(data);
  }

  return people;
}

async function linkPeopleToMemory(
  people: { id: string }[],
  memoryId: string
) {
  if (!people.length) return;

  await supabase.from('people_memories').upsert(
    people.map(p => ({
      person_id: p.id,
      memory_id: memoryId,
    })),
    { onConflict: 'person_id,memory_id' }
  );
}

/* -----------------------------------
   POST: Save Memory
----------------------------------- */

export async function POST(req: Request) {
  try {
    console.log("Trying to save memory...");
    const body = await req.json();
    const parsed = SaveMemorySchema.parse(body);

    const {
      text,
      category,
      title,
      people,
      parentMemoryId,
      isContinuation,
      location,
      dateOfMemory,
    } = parsed;

    /* ---------- Validate auth and prepare request-scoped client ---------- */
    const authHeader = req.headers.get('authorization') ?? req.headers.get('Authorization');
    const token = authHeader?.split(' ')[1];
    if (!token) {
      console.warn('No authorization token provided');
      return Response.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { data: userData, error: userErr } = await supabase.auth.getUser(token);
    if (userErr || !userData?.user) {
      console.warn('Failed to validate token', userErr);
      return Response.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const userId = userData.user.id;

    const reqSupabase = createClient(process.env.EXPO_PUBLIC_SUPABASE_URL!, process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!, {
      global: { headers: { Authorization: `Bearer ${token}` } },
    });

    /* ---------- Thread logic ---------- */

    let threadId = crypto.randomUUID();
    let parentId: string | null = null;

    if (isContinuation && parentMemoryId) {
      const { data } = await reqSupabase
        .from('memories')
        .select('thread_id')
        .eq('id', parentMemoryId)
        .single();

      if (!data) throw new Error('Parent memory not found');

      threadId = data.thread_id;
      parentId = parentMemoryId;
    }

    /* ---------- Title generation ---------- */

    let memoryTitle = title;

    if (!memoryTitle) {
      const result = await generateText({
        model: google('gemini-2.5-flash'),
        prompt: `Create a short 3–5 word title for this memory: "${text}". Only return the title.`,
      });

      memoryTitle = result.text.replace(/^['\"]|['\"]$/g, '').trim();
    }

    console.log('Generated memory title:', memoryTitle);

    /* ---------- Embedding ---------- */

    const { embedding } = await embed({
      model: google.textEmbeddingModel('text-embedding-004'),
      value: text,
    });

    /* ---------- Insert memory ---------- */
    console.log('Preparing to insert memory into database...');

    const insertPayload = {
      text,
      title: memoryTitle,
      category,
      embedding,
      thread_id: threadId,
      parent_memory_id: parentId,
      location,
      date_of_memory: dateOfMemory,
      user_id: userId,
    };

    console.log('Insert payload:', insertPayload);

    const { data: memory, error } = await reqSupabase
      .from('memories')
      .insert(insertPayload)
      .select()
      .single();

    if (error || !memory) {
      console.error('Supabase insert error:', error);
      return Response.json(
        { success: false, error: 'Database insert failed', details: error },
        { status: 500 }
      );
    }

    console.log('Saved memory:', memory);

    /* ---------- People linking ---------- */

    if (people.length) {
      const personRecords = await getOrCreatePeople(people);
      await linkPeopleToMemory(personRecords, memory.id);
    }

    return Response.json({ success: true, memory });

  } catch (err: any) {
    console.error('Save memory error:', err);
    if (err instanceof z.ZodError) {
      return Response.json(
        { success: false, error: 'Invalid input', details: (err as z.ZodError).issues },
        { status: 400 }
      );
    }

    return Response.json(
      { success: false, error: err?.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

/* -----------------------------------
   GET: List Memories
----------------------------------- */

export async function GET() {
  const { data, error } = await supabase
    .from('memories')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return Response.json({ success: false }, { status: 500 });
  }

  return Response.json({ success: true, memories: data });
}