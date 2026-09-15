import { useState } from "react";

export default function ProfileAvatar({ name, avatar, size = 40 }) {
	const [imgError, setImgError] = useState(false);
	const initial = name ? name.trim().charAt(0).toUpperCase() : "?";

	if (avatar && !imgError) {
		return (
			<img
				src={avatar}
				alt={name || "Profile"}
				onError={() => setImgError(true)}
				style={{ width: size, height: size }}
				className="rounded-full object-cover border border-violet-400/40 shrink-0"
			/>
		);
	}

	return (
		<div
			style={{ width: size, height: size }}
			className="rounded-full bg-linear-to-r from-violet-500 to-blue-500 flex items-center justify-center text-white font-bold shrink-0"
		>
			{initial}
		</div>
	);
}
