import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

const ThemeToggle = () => {
  const { setTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={() => {
        const isDark =
          document.documentElement.classList.contains('dark');

        setTheme(isDark ? 'light' : 'dark');
      }}
      className="relative rounded-md p-2 cursor-pointer"
      aria-label="Toggle theme"
    >
      <Sun className="h-5 w-5 dark:hidden" />
      <Moon className="hidden h-5 w-5 dark:block" />
    </button>
  );
};

export default ThemeToggle;