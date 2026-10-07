import { useEffect, useState } from 'react';

import { MoonStarIcon } from '@/shared/ui/tiptap-editor/tiptap-icons/moon-star-icon.tsx';
import { SunIcon } from '@/shared/ui/tiptap-editor/tiptap-icons/sun-icon.tsx';
// --- Icons ---
import { Button } from '@/shared/ui/tiptap-editor/tiptap-ui-primitive/button';

export const ThemeToggle = () => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => setIsDarkMode(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    const initialDarkMode =
      !!document.querySelector('meta[name="color-scheme"][content="dark"]') ||
      window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(initialDarkMode);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode((isDark) => !isDark);

  return (
    <Button
      aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
      variant='ghost'
      onClick={toggleDarkMode}
    >
      {isDarkMode ? (
        <MoonStarIcon className='tiptap-button-icon' />
      ) : (
        <SunIcon className='tiptap-button-icon' />
      )}
    </Button>
  );
};
