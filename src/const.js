export const TOPICS = [
	{
		topic: "Find motivation to start something",
		prompt: "You're on the right track! Tell me about what you've been meaning to start.",
		iconName: "rocket-outline"
	},
	{
		topic: "Outline a project or meeting",
		prompt: "That sounds like a great plan. What's the main goal or purpose?",
		iconName: "document-text-outline"
	},
	{
		topic: "Get more out of your day",
		prompt: "How has your day gone so far? What are you hoping to do with the rest of your day?",
		iconName: "sunny-outline"
	},
	{
		topic: "Develop a new habit or change an old one",
		prompt: "That's a great initiative! Do you have a new habit you're trying to form? Or a bad one you're trying to break?",
		iconName: "construct-outline"
	},
	{
		topic: "Talk about something new or interesting you learned",
		prompt: "Sounds interesting! Share what you learned. Did you enjoy the learning process?",
		iconName: "library-outline"
	},
	{
		topic: "Think through something that's been on your mind",
		prompt: "Of course, I'm here to help. What's on your mind?",
		iconName: "bulb-outline"
	}
];

// used in CoachingSection
export const CONVERSATION_STATE = {
	Start: "starting new",
	Idle: "waiting for next user action (record, send, finish)",
	TranscribingUser: "transcribing...",
	ReadyToSendUserTranscript: "ready to send user message",
	WaitingForCoach: "sending message...",
	FinishWithResult: "finalizing..."
};

export const CHAT_SAVE_STATE = {
	WAITING: "Waiting",
	SAVING: "Saving...",
	SUCCESS: "Saved",
	FAILED: "Autosave failed"
};

export const ERROR_MESSAGE_MAP = {
	469: "HttpError 469: Inappropriate input"
};

export const MIN_CONVERSATION_LENGTH_BEFORE_SAVE = {
	DEFAULT: 4, // 4 messages = [assistant, user, assistant, user]
	daily_intent: 2 // 2 messages = [assistant, user]
};

export const CHAT_TYPE = {
	ORIGINAL: "original",
	FEEDBACK: "feedback",
	DAILY_INTENT: "daily_intent"
};