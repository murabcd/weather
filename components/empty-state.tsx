import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
	icon: LucideIcon;
	title: string;
	description: string;
	actionLabel: string;
	onAction?: () => void;
	isLoading?: boolean;
	buttonIcon?: LucideIcon;
}

export function EmptyState({
	icon: Icon,
	title,
	description,
	actionLabel,
	onAction,
	isLoading = false,
	buttonIcon: ButtonIcon,
}: EmptyStateProps) {
	return (
		<div className="flex flex-col items-center justify-center min-h-[80vh] py-8">
			<div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
				<Icon className="w-10 h-10 text-muted-foreground" />
			</div>
			<h2 className="text-2xl font-semibold mt-6">{title}</h2>
			<p className="text-muted-foreground text-sm mt-2 text-center max-w-sm">
				{description}
			</p>
			{onAction && (
				<div className="mt-6">
					<Button onClick={onAction} disabled={isLoading}>
						{ButtonIcon && <ButtonIcon className="w-4 h-4 mr-2" />}
						{actionLabel}
					</Button>
				</div>
			)}
		</div>
	);
}
