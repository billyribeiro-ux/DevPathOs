import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { chatSessions, chatMessages } from '$lib/server/collections';
import { MENTOR_MODE_DESCRIPTIONS, type MentorMode } from '$lib/types/mentor';

export const GET: RequestHandler = async ({ params }) => {
	const msgs = await chatMessages.findBy(m => m.sessionId === params.id);
	return json(msgs.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()));
};

function generateMentorResponse(mode: MentorMode, userMessage: string): string {
	const responses: Record<MentorMode, string[]> = {
		coach: [
			`Great question! Let me guide you through this. What do you already know about this topic?`,
			`I can see you're working through something interesting. What have you tried so far?`,
			`Let's break this down step by step. What's the first part that feels unclear?`,
			`That's a solid approach! Have you considered what happens when the edge cases come in?`
		],
		teacher: [
			`Let me explain this clearly. The key concept here is about understanding the fundamentals first, then building up.`,
			`Think of it like this: every complex system is just simple parts connected together. Let's start with the simplest part.`,
			`Here's how this works: the underlying mechanism relies on a few core principles. Let me walk you through each one.`,
			`Good question! This is something many developers find tricky at first. The important thing to understand is the mental model.`
		],
		debugger: [
			`Let's debug this systematically. First, can you tell me what the expected behavior should be?`,
			`I see the issue. Let's trace through the execution step by step to find where things diverge.`,
			`Common causes for this kind of issue include: state mutations, async timing, or scope confusion. Let's check each.`,
			`Let's add some checkpoints. What does the state look like right before the error occurs?`
		],
		interviewer: [
			`Tell me: how would you explain this concept to a junior developer?`,
			`If you had to implement this from scratch, what would your approach be?`,
			`What are the trade-offs of this approach compared to alternatives?`,
			`Can you walk me through the time and space complexity of your solution?`
		],
		reflection: [
			`That's an interesting insight. Let me help you turn that into a concrete principle you can reference later.`,
			`It sounds like you've identified a pattern in your learning. Let's document this as a note.`,
			`What was the key "aha moment" here? Let's make sure we capture that understanding.`,
			`Confusion is a signal that you're at the edge of your knowledge. Let's map out what you know vs. what's still fuzzy.`
		]
	};

	const modeResponses = responses[mode];
	return modeResponses[Math.floor(Math.random() * modeResponses.length)];
}

export const POST: RequestHandler = async ({ params, request }) => {
	const session = await chatSessions.findById(params.id);
	if (!session) error(404, 'Session not found');

	const { content } = await request.json();

	// Save user message
	const userMsg = await chatMessages.create({
		id: crypto.randomUUID(),
		sessionId: params.id,
		role: 'user',
		content,
		createdAt: new Date()
	});

	// Generate and save assistant response
	const response = generateMentorResponse(session.mode, content);
	const assistantMsg = await chatMessages.create({
		id: crypto.randomUUID(),
		sessionId: params.id,
		role: 'assistant',
		content: response,
		createdAt: new Date()
	});

	// Update session title from first message
	const allMsgs = await chatMessages.findBy(m => m.sessionId === params.id);
	if (allMsgs.length <= 2 && !session.title) {
		await chatSessions.update(params.id, {
			title: content.length > 50 ? content.slice(0, 50) + '...' : content
		});
	}

	return json([userMsg, assistantMsg], { status: 201 });
};
