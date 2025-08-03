"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

export function ThemeToggle() {
	const { theme, setTheme } = useTheme();
	const [mounted, setMounted] = React.useState(false);

	// useEffect only runs on the client, so now we can safely show the UI
	React.useEffect(() => {
		setMounted(true);
	}, []);

	const toggleTheme = () => {
		setTheme(theme === "light" ? "dark" : "light");
	};

	// Prevent hydration mismatch by not rendering theme-dependent content until mounted
	if (!mounted) {
		return (
			<Button variant="ghost" size="sm" className="w-full cursor-pointer">
				<Sun className="h-4 w-4" />
				<span className="ml-2">Light theme</span>
			</Button>
		);
	}

	const getIcon = () => {
		return theme === "light" ? (
			<Moon className="h-4 w-4" />
		) : (
			<Sun className="h-4 w-4" />
		);
	};

	const getButtonText = () => {
		return theme === "light" ? "Dark theme" : "Light theme";
	};

	return (
		<Button
			variant="ghost"
			size="sm"
			onClick={toggleTheme}
			className="w-full cursor-pointer"
		>
			{getIcon()}
			<span className="ml-2">{getButtonText()}</span>
		</Button>
	);
}
