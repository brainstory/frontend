const questionPrompts = [
	"What can you achieve now that will make your life better for the next month?",
	"What's something that you're proud of?",
	"What are you grateful for right now?",
	"At what time in your recent past have you felt most passionate and alive?",
	"What could have made today better?",
	"What was the wisest decision you made in the past year?",
	"Are you more worried about doing things right, or doing the right things?",
	"What did you think about when brushing your teeth today?",
	"If life is so short, why do we do so many things we don't like and like so many things we don't do?",
	"What are you looking forward to?",
	"What are you most excited about in your life right now - today?",
	"What one thing have you not done that you really want to do?",
	"Who did you speak with today that made you think?",
	"What are you doing to pursue your dreams right now?",
	"Would you rather have less work to do, or more work you actually enjoy doing?",
	"Is there a part of yourself that you want to work on in the upcoming year?",
	"What is something you want to do that you've never done before?",
	"What is a fear that you have & how has it limited you?",
	"What's coming up soon? What could you start proactively processing through now?",
	"What's something you know you do differently than most people?",
	"What was your most recent shower thought?",
	"What's the most recent thing you've learned?",
	"What have you been thinking about lately?",
	"What is the most recent thing you read about? What does it make you want to do?",
	"Are you on the fence about something? Is there a decision you have to make?",
	"Do you need to plan or prep for a meeting? An event?"
];

/** Returns a question prompt for /chat depending on the current day */
export function getQuestionOfTheDay() {
	const todayDate = new Date();
	const todayInDays = Math.floor(todayDate.valueOf() / (1000 * 60 * 60 * 24));
	const quoteIndex = todayInDays % questionPrompts.length;
	return questionPrompts[quoteIndex];
}
