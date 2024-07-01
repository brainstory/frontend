export default function TextsFadeIn({ children, classes }) {
	// very manual mapping of animation names to various delays
	const animateClass = [
		"animate-appear0",
		"animate-appear1",
		"animate-appear2",
		"animate-appear3",
		"animate-appear4",
		"animate-appear5",
		"animate-appear6",
		"animate-appear7"
	];

	const fadeClasses = children.map((_, i) => `${animateClass[i]} opacity-0`);

	return (
		<div className={classes}>
			{children.map((child, i) => (
				<span key={i} className={fadeClasses[i]}>
					{child}
				</span>
			))}
		</div>
	);
}
