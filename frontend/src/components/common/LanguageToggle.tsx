import { useTranslation } from '../../i18n';

export function LanguageToggle() {
  const { language, setLanguage } = useTranslation();

  const options = [
    { value: 'es' as const, label: 'Español', flag: '🇨🇴' },
    { value: 'en' as const, label: 'English', flag: '🇺🇸' },
  ];

  return (
    <div className="flex gap-2">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => setLanguage(option.value)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
            language === option.value
              ? 'bg-[#c3d62f] text-[#132F20] border-[#c3d62f]'
              : 'bg-transparent text-[#132F20] dark:text-[#c3d62f] border-[#c3d62f]/30 hover:bg-[#c3d62f]/10'
          }`}
        >
          <span>{option.flag}</span>
          <span className="text-sm font-medium">{option.label}</span>
        </button>
      ))}
    </div>
  );
}
