import React, { useEffect, useRef, useState } from "react";

const EditableTextItem = ({ initialText, setText }) => {
	const [isEditing, setIsEditing] = useState(false);
	const [thisText, setThisText] = useState(initialText);
	const inputRef = useRef(null);

	const handleClick = () => {
		setIsEditing(true);
	};

	const handleChange = (event) => {
		setThisText(event.target.value);
	};

	const handleBlur = () => {
		setText(thisText.trim());
		setIsEditing(false);
	};

	useEffect(() => {
		if (isEditing) {
			inputRef.current.focus();
		}
		setThisText(thisText);
	}, [isEditing]);

	return (
		<div className="text-stone-800 flex justify-center" onClick={handleClick}>
			{isEditing ? (
				<textarea
					type="text"
					value={thisText}
					onChange={handleChange}
					onBlur={handleBlur}
					ref={inputRef}
					rows={3}
					className="w-full bg-pink-50 rounded-lg border border-pink-300 focus:ring-pink-500 focus:border-pink-500 selection:bg-pink-500 selection:text-white"
				/>
			) : (
				<div className="h-[60px] sm:h-[72px] flex items-center">
					<p className="text-center line-clamp-2 border-4 border-transparent text-ellipsis">
						{initialText}
					</p>
				</div>
			)}
		</div>
	);
};

export default EditableTextItem;
