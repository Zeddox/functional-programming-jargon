// Class names shared by the editor's surroundings (brief, run bar, console)
export const codeTheme = (isDark) => {
  const line = isDark ? 'border-[rgba(240,240,238,0.12)]' : 'border-[rgba(26,26,25,0.12)]';
  return {
    surface: isDark ? 'bg-[#121212] text-[#f0f0ee] border-[rgba(240,240,238,0.12)]' : 'bg-[#eaeae8] text-[#1a1a19] border-[rgba(26,26,25,0.12)]',
    line,
    subtle: isDark ? 'bg-[#1a1a19]' : 'bg-[#e2e2df]',
    button: `inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs transition-colors disabled:opacity-40 ${line} ${isDark ? 'hover:bg-[#242422]' : 'hover:bg-[#d8d8d5]'}`,
  };
};
