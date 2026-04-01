import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { useTranslation } from '../i18n';

export default function WelcomePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative overflow-hidden bg-white">
      <div
        className="absolute inset-x-0 top-0 h-[70vh]"
        style={{
          background: 'radial-gradient(ellipse at top, #c3d730 0%, #9aa836 100%)',
          borderBottomLeftRadius: '50% 20%',
          borderBottomRightRadius: '50% 20%'
        }}
      />

      <div className="relative z-10 flex flex-col justify-between min-h-screen px-4 py-8">
        <div className="flex flex-col items-center mt-20">
          <div className="w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 bg-white dark:bg-[#1a2e24] rounded-full flex items-center justify-center shadow-lg border-4 border-[#c3d62f]">
            <svg
              className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 text-[#132F20] dark:text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>

          <h1 className="text-5xl sm:text-5xl md:text-6xl font-display font-bold text-[#132F20] text-center px-4 mt-8">
            Biblioteca Libre UTS
          </h1>
        </div>

        <div className="flex flex-col items-center">
          <div className="w-full max-w-xs sm:max-w-sm flex flex-col items-center gap-4">
            <Button
              onClick={() => navigate('/login')}
              className="w-full py-4 text-lg"
            >
              {t('welcome.loginButton')}
            </Button>

            <p className="text-base text-[#5a6b5c] dark:text-[#132F20]">
              {t('welcome.noAccount')}{' '}
              <Link
                to="/register"
                className="text-[#132F20] dark:text-[#c3d62f] font-medium hover:underline"
              >
                {t('welcome.register')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
