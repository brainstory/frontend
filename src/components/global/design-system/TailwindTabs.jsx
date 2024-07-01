import React, { useState, createContext, useContext, Children } from "react";

/*

Usage (or look at TailwindComposedTabs):

<TailwindTabs>
	<TailwindTabList>
		{data.map(tab => (
			<TailwindTab>{tab.label}</TailwindTab>
		))}
	</TailwindTabList>
	<TailwindTabPanels>
		{data.map(tab => (
			<TailwindTabPanel>{tab.content}</TailwindTabPanel>
		))}
	</TailwindTabPanels>
</TailwindTabs>

*/

const TabsContext = createContext();

function TailwindTabs({ children, activeTab = 0 }) {
	const [activeIndex, setActiveIndex] = useState(activeTab);
	return (
		<TabsContext.Provider value={{ activeIndex, setActiveIndex }}>
			<div className="h-full">{children}</div>
		</TabsContext.Provider>
	);
}

const TabContext = createContext();

function TailwindTabList({ children }) {
	const wrappedChildren = Children.map(children, (child, index) => (
		<TabContext.Provider value={index}>{child}</TabContext.Provider>
	));
	return <ul className="flex flex-wrap justify-center mb-6 gap-1">{wrappedChildren}</ul>;
}

function TailwindTab({ children, isDisabled, tooltipText = "", ...rest }) {
	const index = useContext(TabContext);
	const { activeIndex, setActiveIndex } = useContext(TabsContext);
	const isActive = index === activeIndex;

	return (
		<div className="group inline-block relative">
			<li
				className={`cursor-pointer text-sm font-medium bg-white p-3 border-b-4 ${
					isDisabled
						? "disabled opacity-50 cursor-not-allowed hover:unset"
						: isActive
						? `active border-pink-300`
						: "hover:text-pink-600 hover:border-accent-900"
				}`}
				onClick={isDisabled ? undefined : () => setActiveIndex(index)}
				key={index + "tab"}
				{...rest}
			>
				{children}
			</li>
			{tooltipText !== "" && (
				<div className="w-full text-center pointer-events-none absolute top-full left-1/2 transform -translate-x-1/2 p-2 bg-stone-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
					{tooltipText}
				</div>
			)}
		</div>
	);
}

function TailwindTabPanels({ children }) {
	const { activeIndex } = useContext(TabsContext);
	return children[activeIndex];
}

function TailwindTabPanel({ children }) {
	return children;
}

function TailwindComposedTabs({ data, activeTab = 0 }) {
	return (
		<TailwindTabs activeTab={activeTab}>
			<TailwindTabList>
				{data.map((tab, i) => (
					<TailwindTab
						isDisabled={tab.disabled}
						tooltipText={tab.tooltipText ? tab.tooltipText : ""}
						key={`tw-tab-${i}`}
					>
						{tab.label}
					</TailwindTab>
				))}
			</TailwindTabList>
			<TailwindTabPanels>
				{data.map((tab, i) => (
					<TailwindTabPanel key={`tw-tabp-${i}`}>{tab.content}</TailwindTabPanel>
				))}
			</TailwindTabPanels>
		</TailwindTabs>
	);
}

export {
	TailwindTabs,
	TailwindTabList,
	TailwindTab,
	TailwindTabPanels,
	TailwindTabPanel,
	TailwindComposedTabs
};
