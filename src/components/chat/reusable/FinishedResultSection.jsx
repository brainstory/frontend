import GeneratingResult from "@src/components/chat/generating-result/GeneratingResult";
import StickyLoadingSection from "@src/components/chat/generating-result/StickyLoadingSection";

export default function FinishedResultSection({ result, readyForFinish, ideaId }) {
	return (
		<section>
			<div className="relative mx-auto w-full max-w-5xl lg:px-24 md:px-12 px-2 p-2">
				<div className="flex flex-col border border-stone-200 rounded-lg shadow my-4">
					<GeneratingResult summary={result} />
				</div>
			</div>
			<StickyLoadingSection isFinishedGenerating={readyForFinish} ideaId={ideaId} />
		</section>
	);
}
