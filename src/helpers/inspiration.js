const quotes = [
	"What can you achieve now that will make your life better for the next month?",
	"What's something that you're proud of?",
	"What are you grateful for right now?",
	"At what time in your recent past have you felt most passionate and alive?",
	"Maintain Internal Heights - Trevor Hall",
	"What could have made today better?",
	"What was the wisest decision you made in the past year?",
	"Are you more worried about doing things right, or doing the right things?",
	"What did you think about when brushing your teeth today?",
	"If life is so short, why do we do so many things we don't like and like so many things we don't do?",
	"What are you looking forward to?",
	"What are you most excited about in your life right now - today?",
	"What are you most grateful for?",
	"What are you most proud of?",
	"What one thing have you not done that you really want to do?",
	"Who did you speak with today that made you think?",
	"Why are you, you?",
	"What are you doing to pursue your dreams right now?",
	"Would you rather have less work to do, or more work you actually enjoy doing?",
	"The reasonable man adapts himself to the world; the unreasonable one persists in trying to adapt the world to himself. Therefore all progress depends on the unreasonable man. — George Bernard Shaw",
	"Those who dare to fail miserably can achieve greatly. — John F. Kennedy",
	"It is hard to fail, but it is worse never to have tried to succeed. — Theodore Roosevelt",
	"Only those who will risk going too far can possibly find out how far one can go. — T.S. Eliot",
	"Life is not measured by the number of breaths we take, but by the moments that take our breath away. — Maya Angelou",
	"Life is either a daring adventure or nothing at all. — Helen Keller",
	"Is there a part of yourself that you want to work on in the upcoming year?",
	"What is something you want to do that you've never done before?",
	"Don't count the days. Make the days count. — Muhammad Ali",
	"Life is not about finding yourself. Life is about creating yourself. — Lolly Daskal",
	"What is a fear that you have & how has it limited you?",
	"Life is 10% what happens to you and 90% how you react to it. — Charles R. Swindoll",
	"The 1-1-1 method: 1 win from the day, 1 point of tension, 1 bit of gratitude.",
	"What's coming up soon? What could you start proactively processing through now?",
	"What's something you know you do differently than most people?",
	"What one thing have you not done that you really want to do?",
	"What was your most recent shower thought?",
	"What's the most recent thing you've learned?",
	"What have you been thinking about lately?",
	"What is the most recent thing you read about? What does it make you want to do?"
];

export function getInspiringQuote() {
	// A function that returns a random quote from a list of quotes
	const randomIndex = Math.floor(Math.random() * quotes.length);
	return quotes[randomIndex];
}
