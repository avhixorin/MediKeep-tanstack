import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

const ThemeToggle = () => {
    const { theme, setTheme } = useTheme();

    return (
        <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-md p-2 cursor-pointer"
        >
            {theme === "dark" ?
                <Moon className="h-5 w-5" />
                :
                <Sun className="h-5 w-5" />
            }
        </button>
    );
};

export default ThemeToggle;