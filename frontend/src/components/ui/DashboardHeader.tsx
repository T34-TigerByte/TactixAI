import { useState } from 'react';
import { LogOut, CheckCircle, Menu, X, ArrowLeft, User } from 'lucide-react';
import Logo from './Logo';

interface DashboardHeaderProps {
  title: string;
  subtitle: string;
  uptime?: number;
  onLogout: () => void;
  onLogoClick?: () => void;
  onBack?: () => void; // For nested page (optional)
  onProfile?: () => void; // For learner dashboard profile link (optional)
}

export default function DashboardHeader({ title, subtitle, uptime, onLogout, onLogoClick, onBack, onProfile }: DashboardHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className='fixed top-0 left-0 right-0 z-50 bg-slate-900 px-4 sm:px-8 py-4'>
      <div className='max-w-7xl mx-auto flex items-center justify-between'>
        <div className='flex items-center gap-3 sm:gap-6 min-w-0'>
          {onBack && (
            <button
              onClick={onBack}
              aria-label='Back to dashboard'
              className='hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-600
                         text-slate-300 hover:border-slate-400 hover:text-white transition-colors text-sm cursor-pointer'
            >
              <ArrowLeft className='w-4 h-4' aria-hidden='true' />
              Back
            </button>
          )}
          <button
            onClick={onLogoClick}
            disabled={!onLogoClick}
            className='disabled:cursor-default cursor-pointer'
            aria-label='Go to dashboard'
          >
            <Logo />
          </button>
          <div className='h-6 w-px bg-slate-600 shrink-0' aria-hidden='true' />
          <div className='min-w-0'>
            <h1 className='text-white font-bold text-base sm:text-lg leading-tight truncate'>
              {title}
            </h1>
            <p className='text-slate-400 text-sm hidden sm:block'>{subtitle}</p>
          </div>
        </div>

        {/* Desktop actions */}
        <div className='hidden sm:flex items-center gap-3'>
          {uptime !== undefined && (
            <div className='flex items-center gap-2 px-4 py-2 rounded-lg bg-teal-500/20 border border-teal-500/30 text-teal-400 text-sm font-medium'>
              <CheckCircle className='w-4 h-4' />
              {uptime}% Uptime
            </div>
          )}
          {onProfile && (
            <button
              onClick={onProfile}
              className='flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-600 hover:bg-orange-700 text-white transition-colors text-sm font-medium cursor-pointer'
              aria-label='To My Profile'
            >
              <User className='w-4 h-4' aria-hidden='true' />
              Profile
            </button>
          )}
          <button
            onClick={onLogout}
            className='flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-600 text-slate-300 hover:border-slate-400 hover:text-white transition-colors text-sm font-medium cursor-pointer'
            aria-label='Logout'
          >
            <LogOut className='w-4 h-4' aria-hidden='true' />
            Logout
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          className='sm:hidden flex items-center justify-center p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700 transition-colors shrink-0 cursor-pointer'
          aria-label='Toggle menu'
        >
          {mobileMenuOpen ? (
            <X className='w-5 h-5' />
          ) : (
            <Menu className='w-5 h-5' />
          )}
        </button>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div className='sm:hidden mt-3 pt-3 border-t border-slate-700 flex flex-col gap-2'>
          {onBack && (
            <button
              onClick={onBack}
              className='flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-600 text-slate-300 hover:border-slate-400 hover:text-white transition-colors text-sm font-medium w-full cursor-pointer'
            >
              <ArrowLeft className='w-4 h-4' />
              Back
            </button>
          )}
          {uptime !== undefined && (
            <div className='flex items-center gap-2 px-4 py-2 rounded-lg bg-teal-500/20 border border-teal-500/30 text-teal-400 text-sm font-medium w-full'>
              <CheckCircle className='w-4 h-4' />
              {uptime}% Uptime
            </div>
          )}
          {onProfile && (
            <button
              onClick={onProfile}
              className='flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium w-full cursor-pointer'
            >
              <User className='w-4 h-4' />
              Profile
            </button>
          )}
          <button
            onClick={onLogout}
            className='flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-600 text-slate-300 hover:border-slate-400 hover:text-white transition-colors text-sm font-medium w-full cursor-pointer'
          >
            <LogOut className='w-4 h-4' />
            Logout
          </button>
        </div>
      )}
    </header>
  );
}