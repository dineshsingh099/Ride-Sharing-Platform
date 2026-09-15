export default function FormError({ message, type = "error" }) {
	const isSuccess = type === "success";

	return (
		<div className="mt-2 min-h-5">
			{message && (
				<p
					className={`text-sm font-medium leading-snug flex items-center gap-1.5 ${
						isSuccess ? "text-emerald-400" : "text-red-400"
					}`}
				>
					{message}
				</p>
			)}
		</div>
	);
}
