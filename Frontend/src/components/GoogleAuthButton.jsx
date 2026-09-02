import { useEffect, useRef, useState } from "react";

let googleScriptPromise = null;
let preconnected = false;

function addPreconnect() {
	if (preconnected) {
		return;
	}
	preconnected = true;

	["https://accounts.google.com", "https://apis.google.com"].forEach((href) => {
		const link = document.createElement("link");
		link.rel = "preconnect";
		link.href = href;
		link.crossOrigin = "anonymous";
		document.head.appendChild(link);
	});
}

function loadGoogleScript() {
	addPreconnect();

	if (window.google?.accounts?.id) {
		return Promise.resolve();
	}

	if (googleScriptPromise) {
		return googleScriptPromise;
	}

	googleScriptPromise = new Promise((resolve, reject) => {
		const existing = document.getElementById("google-identity-script");

		if (existing) {
			existing.addEventListener("load", () => resolve());
			existing.addEventListener("error", () =>
				reject(new Error("Failed to load Google script")),
			);
			return;
		}

		const script = document.createElement("script");
		script.id = "google-identity-script";
		script.src = "https://accounts.google.com/gsi/client";
		script.async = true;
		script.defer = true;
		script.onload = () => resolve();
		script.onerror = () => reject(new Error("Failed to load Google script"));

		document.head.appendChild(script);
	});

	return googleScriptPromise;
}

const SLOW_LOAD_TIMEOUT_MS = 8000;

export default function GoogleAuthButton({
	getNonce,
	onCredential,
	onError,
	disabled = false,
}) {
	const containerRef = useRef(null);
	const [ready, setReady] = useState(false);
	const [showRetry, setShowRetry] = useState(false);

	const getNonceRef = useRef(getNonce);
	const onCredentialRef = useRef(onCredential);
	const onErrorRef = useRef(onError);
	const readyRef = useRef(false);
	const renderRef = useRef(null);

	useEffect(() => {
		getNonceRef.current = getNonce;
		onCredentialRef.current = onCredential;
		onErrorRef.current = onError;
	});

	useEffect(() => {
		let cancelled = false;
		let slowLoadTimer = null;

		async function renderGoogleButton() {
			try {
				await loadGoogleScript();

				if (cancelled || !containerRef.current) {
					return;
				}

				const { nonce } = await getNonceRef.current();

				if (cancelled || !containerRef.current) {
					return;
				}

				containerRef.current.innerHTML = "";

				window.google.accounts.id.initialize({
					client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
					callback: async (response) => {
						if (cancelled) {
							return;
						}

						try {
							await onCredentialRef.current(response.credential, nonce);
						} finally {
							if (!cancelled) {
								try {
									await renderGoogleButton();
								} catch (err) {
									if (!cancelled) {
										onErrorRef.current(
											err?.message || "Unable to prepare Google Sign-In",
										);
									}
								}
							}
						}
					},
					nonce,
					ux_mode: "popup",
					auto_select: false,
				});

				window.google.accounts.id.renderButton(containerRef.current, {
					theme: "filled_black",
					size: "large",
					shape: "rectangular",
					text: "continue_with",
					logo_alignment: "left",
					width: containerRef.current.offsetWidth || 320,
				});

				if (!cancelled) {
					readyRef.current = true;
					setReady(true);
					setShowRetry(false);
					if (slowLoadTimer) {
						clearTimeout(slowLoadTimer);
					}
				}
			} catch (err) {
				if (!cancelled) {
					readyRef.current = false;
					setReady(false);
					onErrorRef.current(err?.message || "Unable to load Google Sign-In");
				}
			}
		}

		renderRef.current = renderGoogleButton;

		renderGoogleButton();

		slowLoadTimer = setTimeout(() => {
			if (!cancelled && !readyRef.current) {
				setShowRetry(true);
			}
		}, SLOW_LOAD_TIMEOUT_MS);

		return () => {
			cancelled = true;
			if (slowLoadTimer) {
				clearTimeout(slowLoadTimer);
			}
		};
	}, []);

	const handleRetry = () => {
		setShowRetry(false);
		renderRef.current?.();
	};

	return (
		<div
			className={`w-full flex flex-col items-center gap-2 ${
				disabled ? "opacity-50 pointer-events-none" : ""
			}`}
		>
			<div className="relative w-full h-12 rounded-xl overflow-hidden">
				<div className="absolute inset-0 flex items-center justify-center gap-3 rounded-xl bg-[#15151F] border border-violet-500/25 shadow-inner shadow-black/30">
					<img src="/google.png" alt="" className="w-6 h-6 shrink-0" />
					<span className="font-semibold text-[15px] text-white tracking-wide">
						Continue with Google
					</span>
				</div>

				<div
					ref={containerRef}
					className={`absolute inset-0 w-full h-full opacity-0 [&>div]:w-full! [&>div]:h-full! [&_iframe]:w-full! [&_iframe]:h-full! ${
						ready ? "cursor-pointer" : "pointer-events-none"
					}`}
				/>
			</div>

			{showRetry && !ready && (
				<button
					type="button"
					onClick={handleRetry}
					className="text-sm text-violet-300 hover:text-violet-200 underline underline-offset-2"
				>
					Taking longer than expected. Tap to retry
				</button>
			)}
		</div>
	);
}
