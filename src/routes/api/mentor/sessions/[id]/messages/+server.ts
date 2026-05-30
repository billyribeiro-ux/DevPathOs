import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { chatSessions, chatMessages } from '$lib/server/collections';
import { MENTOR_MODE_DESCRIPTIONS, type MentorMode } from '$lib/types/mentor';

export const GET: RequestHandler = async ({ params, locals }) => {
	if (!locals.user) error(401, 'Unauthorized');
	const session = await chatSessions.findById(params.id);
	if (!session || session.userId !== locals.user.id) error(404, 'Session not found');

	const msgs = await chatMessages.findBy(m => m.sessionId === params.id);
	return json(msgs.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()));
};

function generateMentorResponse(mode: MentorMode, userMessage: string): string {
	const lower = userMessage.toLowerCase();
	const responses: Record<MentorMode, () => string> = {
		coach: () => {
			if (lower.includes('stuck') || lower.includes('help'))
				return `I hear you're stuck. Let's break this down: What's the smallest part of this problem you *do* understand? Start there and we'll build up.`;
			if (lower.includes('how'))
				return `Great question! Before I answer, tell me: what's your current mental model of how this works? That way I can build on what you already know.`;
			return `Interesting! Let me push you a bit here — what have you already tried? What was the result? Understanding your approach helps me guide you better.`;
		},
		teacher: () => {
			if (lower.includes('what is') || lower.includes('explain'))
				return `Let me break this down step by step.\n\n**Core concept:** Think of it like building blocks — each piece connects to the next. The key insight is understanding *why* each piece exists, not just *what* it does.\n\nWant me to go deeper on any part?`;
			if (lower.includes('example'))
				return `Here's a practical example:\n\nImagine you're building a todo app. The concept you're asking about is like the foundation — without it, everything above wobbles. Let me show you exactly how it fits in with a concrete scenario.`;
			return `Good question! Here's the mental model I'd use:\n\n1. Start with the simplest version of the concept\n2. Layer on complexity one piece at a time\n3. Connect it to something you already know\n\nWhich part should we explore first?`;
		},
		debugger: () => {
			if (lower.includes('error') || lower.includes('bug'))
				return `Let's debug systematically:\n\n1. **Reproduce**: Can you trigger this consistently?\n2. **Isolate**: What's the smallest code that shows the bug?\n3. **Inspect**: What do the dev tools show at the failure point?\n\nStart with step 1 — consistency tells us if it's a race condition or a logic error.`;
			return `Let's trace through this step by step:\n\n**Expected behavior:** What *should* happen?\n**Actual behavior:** What *does* happen?\n**The gap:** That's where the bug lives.\n\nDescribe both and we'll narrow it down.`;
		},
		interviewer: () => {
			if (lower.includes('prepare') || lower.includes('interview'))
				return `Let's practice. Here's a question:\n\n"Can you explain the difference between server-side rendering and client-side rendering? When would you choose one over the other?"\n\nTake your time. I'll evaluate your answer for clarity, depth, and real-world awareness.`;
			return `Good. Now let me challenge you:\n\n"Walk me through how you'd architect this from scratch. What trade-offs would you consider? How would you handle scale?"\n\nI'm looking for: structured thinking, awareness of trade-offs, and practical reasoning.`;
		},
		reflection: () => {
			if (lower.includes('confused') || lower.includes("don't understand"))
				return `Confusion is valuable — it means you're at the edge of your knowledge. Let's capture this:\n\n**What I know:** [fill in]\n**What confuses me:** [fill in]\n**What I think might be true:** [fill in]\n\nWrite those down in your notes. The "might be true" part often contains the breakthrough.`;
			return `Let's turn this into a learning principle:\n\n**What happened:** You encountered something new\n**What you learned:** [the insight]\n**How to remember it:** [create a flashcard or note]\n\nCapturing insights as they happen is what separates fast learners from slow ones.`;
		}
	};

	return responses[mode]();
}

export const POST: RequestHandler = async ({ params, request, locals }) => {
	if (!locals.user) error(401, 'Unauthorized');
	const session = await chatSessions.findById(params.id);
	if (!session || session.userId !== locals.user.id) error(404, 'Session not found');

	const raw = await request.json().catch(() => null);
	if (!raw?.content || typeof raw.content !== 'string' || raw.content.length > 10000)
		error(400, 'Invalid message');

	const content = raw.content.trim();
	if (!content) error(400, 'Message cannot be empty');

	const userMsg = await chatMessages.create({
		id: crypto.randomUUID(),
		sessionId: params.id,
		role: 'user',
		content,
		createdAt: new Date()
	});

	const response = generateMentorResponse(session.mode, content);
	const assistantMsg = await chatMessages.create({
		id: crypto.randomUUID(),
		sessionId: params.id,
		role: 'assistant',
		content: response,
		createdAt: new Date()
	});

	if (!session.title) {
		await chatSessions.update(params.id, {
			title: content.length > 50 ? content.slice(0, 50) + '...' : content
		});
	}

	return json([userMsg, assistantMsg], { status: 201 });
};
