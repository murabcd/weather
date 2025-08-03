"use client";

import type * as React from "react";

import { ListItem } from "@/components/list-item";
import { ThemeToggle } from "@/components/theme-toggle";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarRail,
} from "@/components/ui/sidebar";

interface City {
	name: string;
	country: string;
	lat: number;
	lon: number;
	key: string;
}

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
	cities?: City[];
	selectedCity?: City | null;
	onRemoveCity?: (cityKey: string) => void;
	onSelectCity?: (city: City) => void;
}

export function AppSidebar({
	cities = [],
	selectedCity,
	onRemoveCity,
	onSelectCity,
	...props
}: AppSidebarProps) {
	return (
		<Sidebar collapsible="icon" variant="sidebar" {...props}>
			<SidebarContent className="p-4 space-y-3">
				{cities.length === 0 ? (
					<div className="text-sm text-muted-foreground text-center py-8">
						No cities added yet. Click "Add city" to get started.
					</div>
				) : (
					cities.map((city) => (
						<ListItem
							key={city.key}
							city={city}
							isSelected={selectedCity?.key === city.key}
							onSelect={() => onSelectCity?.(city)}
							onRemove={() => onRemoveCity?.(city.key)}
						/>
					))
				)}
			</SidebarContent>
			<SidebarFooter className="p-4">
				<div className="flex justify-center">
					<ThemeToggle />
				</div>
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
