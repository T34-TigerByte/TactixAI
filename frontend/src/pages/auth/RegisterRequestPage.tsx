import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import Logo from '../../components/ui/Logo';
import { ROUTES } from '../../router/routes';
import { submitRegistrationRequestRequest } from '../../api/auth.api';

const FIELD_ERROR_MESSAGES: Record<string, Record<string, string>> = {
  email: {
    'has already been taken': 'This email is already registered. Please sign in instead.',
    'has a pending registration request': 'A request with this email is already pending admin review. Please wait for their response.',
    'is invalid': 'Please enter a valid email address.',
  },
};

export default function RegisterRequestPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    company: '',
    email: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});
    setIsLoading(true);
    try {
      await submitRegistrationRequestRequest(form);
      setSubmitted(true);
    } catch (err: unknown) {
      const detail = (err as { response?: { data?: { errors?: Record<string, string[]> } } })
        ?.response?.data?.errors;
      if (detail) {
        const mapped: Record<string, string> = {};
        for (const [field, messages] of Object.entries(detail)) {
          const raw = messages[0] ?? '';
          mapped[field] = FIELD_ERROR_MESSAGES[field]?.[raw] ?? raw;
        }
        setFieldErrors(mapped);
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className='min-h-screen flex flex-col'
      style={{
        backgroundImage: "url('/dark-blue_texture_triangle_bg.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <header className='px-8 py-5 flex items-center gap-3'>
        <Logo />
      </header>

      <main className='flex-1 flex items-center justify-center px-4 py-12'>
        <div className='w-full max-w-md'>
          <button
            onClick={() => navigate(ROUTES.LOGIN)}
            className='flex items-center gap-1.5 text-slate-400 hover:text-white text-sm mb-6 transition-colors cursor-pointer'
          >
            <ArrowLeft className='w-4 h-4' />
            Back to Sign In
          </button>

          <div className='bg-white rounded-2xl shadow-2xl p-8 space-y-6'>
            {submitted ? (
              <div className='flex flex-col items-center text-center gap-4 py-4'>
                <CheckCircle className='w-14 h-14 text-green-500' />
                <div className='space-y-1'>
                  <h2 className='text-xl font-bold text-gray-900'>Request Submitted</h2>
                  <p className='text-sm text-gray-500'>
                    Your request has been sent to the administrator. You'll receive an email once it's reviewed.
                  </p>
                </div>
                <button
                  onClick={() => navigate(ROUTES.LOGIN)}
                  className='mt-2 px-6 py-2.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-sm font-semibold transition-colors cursor-pointer'
                >
                  Back to Sign In
                </button>
              </div>
            ) : (
              <>
                <div className='space-y-1'>
                  <h2 className='text-2xl font-bold text-gray-900'>Request Access</h2>
                  <p className='text-sm text-gray-500'>
                    Fill in your details and an administrator will review your request.
                  </p>
                </div>

                {error && (
                  <div className='p-3 rounded-lg bg-red-50 border border-red-200'>
                    <p className='text-red-600 text-sm text-center'>{error}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className='space-y-4'>
                  <div className='grid grid-cols-2 gap-3'>
                    <div className='space-y-1.5'>
                      <label className='text-gray-700 text-sm font-medium'>First Name</label>
                      <input
                        name='first_name'
                        value={form.first_name}
                        onChange={handleChange}
                        placeholder='Jane'
                        required
                        className='w-full px-4 py-3 rounded-lg border border-gray-200 text-gray-900 text-sm
                                   placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent transition'
                      />
                    </div>
                    <div className='space-y-1.5'>
                      <label className='text-gray-700 text-sm font-medium'>Last Name</label>
                      <input
                        name='last_name'
                        value={form.last_name}
                        onChange={handleChange}
                        placeholder='Doe'
                        required
                        className='w-full px-4 py-3 rounded-lg border border-gray-200 text-gray-900 text-sm
                                   placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent transition'
                      />
                    </div>
                  </div>

                  <div className='space-y-1.5'>
                    <label className='text-gray-700 text-sm font-medium'>Company Name</label>
                    <input
                      name='company'
                      value={form.company}
                      onChange={handleChange}
                      placeholder='Acme Corp'
                      required
                      className='w-full px-4 py-3 rounded-lg border border-gray-200 text-gray-900 text-sm
                                 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent transition'
                    />
                  </div>

                  <div className='space-y-1.5'>
                    <label className='text-gray-700 text-sm font-medium'>Email Address</label>
                    <input
                      name='email'
                      type='email'
                      value={form.email}
                      onChange={(e) => {
                        handleChange(e);
                        if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: '' }));
                      }}
                      placeholder='jane@acme.com'
                      required
                      className={`w-full px-4 py-3 rounded-lg border text-gray-900 text-sm
                                 placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition
                                 ${fieldErrors.email
                                   ? 'border-red-400 focus:ring-red-300'
                                   : 'border-gray-200 focus:ring-orange-600'}`}
                    />
                    {fieldErrors.email && (
                      <p className='text-xs text-red-500'>{fieldErrors.email}</p>
                    )}
                  </div>

                  <button
                    type='submit'
                    disabled={isLoading}
                    className='w-full py-3 rounded-lg font-semibold text-white bg-orange-600 hover:bg-orange-500
                               active:bg-orange-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer'
                  >
                    {isLoading ? 'Submitting...' : 'Submit Request'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
