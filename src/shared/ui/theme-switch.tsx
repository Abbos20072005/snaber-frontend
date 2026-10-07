import { useLingui } from '@lingui/react/macro';
import { MoonIcon, SunIcon } from 'lucide-react';
import { useEffect } from 'react';

import { useTheme } from '@/shared/context/theme-context.tsx';
import { Button } from '@/shared/ui/button.tsx';

export const ThemeSwitch = () => {
  const { t } = useLingui();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const themeColor = theme === 'dark' ? '#020817' : '#fff';
    const metaThemeColor = document.querySelector("meta[name='theme-color']");
    if (metaThemeColor) metaThemeColor.setAttribute('content', themeColor);
  }, [theme]);

  return (
    <Button
      className='shrink-0 scale-95 rounded-full'
      size='icon'
      variant='ghost'
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    >
      <SunIcon className='size-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90' />
      <MoonIcon className='absolute size-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0' />
      <span className='sr-only'>{t`Toggle theme`}</span>
    </Button>
  );
};
