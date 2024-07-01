const PUBLIC_API_URL = import.meta.env.PUBLIC_API_URL;
import { setCookie } from "@helpers/cookie";

export default function CreateAccountCTA({ creatorName, sharedIdeaTitle }) {
	return (
		<div className="py-8 container mx-auto">
			<div className="text-center">
				<h2 className="mb-2 text-lg md:text-xl text-stone-600">
					Check out {creatorName}'s idea
				</h2>
				<h2 className="mb-6 text-2xl md:text-3xl text-stone-800">{sharedIdeaTitle}</h2>
			</div>

			<div className="mt-2 flex flex-col items-center max-w-[710px] mx-auto">
				<button
					className="w-[250px] bg-white hover:bg-pink-100 text-accent-900 border border-accent-900 font-semibold px-4 py-2 rounded-full transition duration-300"
					onClick={() => {
						setCookie("auth_redirect_url", window.location.href);
						location.href = `${PUBLIC_API_URL}auth-brainstory/v1/flow/user`;
					}}
				>
					Log in to Brainstory
				</button>

				<p className="text-stone-500 my-2 text-sm">or</p>

				<button
					className="w-[280px] mb-4 bg-pink-500 hover:bg-pink-600 text-white font-semibold px-4 py-2 rounded-full transition duration-300"
					onClick={() => {
						setCookie("auth_redirect_url", window.location.href);
						location.href = `${PUBLIC_API_URL}auth-brainstory/v1/flow/user`;
					}}
				>
					Sign up for free
				</button>

				<div className="flex flex-wrap sm:flex-nowrap flex-row gap-4">
					<CTACard
						title="Think-out-loud tool"
						description="Talk through any thoughts or ideas for quick insights and creative boosts."
						IonIcon={
							<ion-icon
								class="w-10 h-10 hydrated"
								name="chatbubble-ellipses-outline"
							/>
						}
					/>
					<CTACard
						title="Easy async collaboration"
						description="Receive and give feedback for ideas with peers and team members."
						IonIcon={<ion-icon class="w-10 h-10 hydrated" name="people-outline" />}
					/>
					<CTACard
						title="Get Started for Free Today"
						description="Your first month is free, on us!"
						IonIcon={<ion-icon class="w-10 h-10 hydrated" name="sparkles-outline" />}
					/>
				</div>
			</div>
		</div>
	);
}

function CTACard({ title, description, IonIcon }) {
	return (
		<div className="w-full md:basis-1/3 bg-white border border-stone-200 p-7 rounded-lg shadow-md text-center">
			{IonIcon}
			<h3 className="text-xl font-semibold mt-2 mb-4 leading-7">{title}</h3>
			<p className="text-stone-600 text-start">{description}</p>
		</div>
	);
}