import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, useLocation } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import { loginSchema, type LoginFormValues } from '@/schemas/auth.schema'
import { useLoginMutation } from '@/hooks/useAuthMutations'
import { FormField } from '@/components/common/FormField'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toApiError } from '@/lib/axios'
import { ROUTES } from '@/config/routes'

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ?? ROUTES.DASHBOARD

  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  const loginMutation = useLoginMutation({
    onSuccess: () => navigate(from, { replace: true }),
    onError: (err) => {
      const e = toApiError(err)
      setError('root', { message: e.message })
    },
  })

  const onSubmit = (values: LoginFormValues) => loginMutation.mutate(values)
  const isPending = loginMutation.isPending

  return (
    <main
      // Refaktor background kompleks menggunakan arbitrary value Tailwind v4
      className="relative min-h-screen w-full flex items-center justify-center px-4 overflow-hidden text-slate-900 bg-[radial-gradient(circle_at_top_left,rgba(237,140,45,0.18),transparent_35%),radial-gradient(circle_at_85%_20%,rgba(251,191,36,0.15),transparent_28%),linear-gradient(180deg,#fdfbf7_0%,#f7ebe1_50%,#f4e3d4_100%)]"
    >
      {/* Decorative orbs */}
      <div className="pointer-events-none absolute rounded-full -top-28 -left-24 w-72 h-72 blur-[10px] opacity-85 bg-[radial-gradient(circle,rgba(237,140,45,0.24),transparent_68%)]" />
      <div className="pointer-events-none absolute rounded-full -right-20 -bottom-24 w-80 h-80 blur-[10px] opacity-85 bg-[radial-gradient(circle,rgba(251,146,60,0.2),transparent_70%)]" />

      {/* Card - Animasi bisa dimasukkan ke file CSS utama pakai @utility atau @keyframes v4 */}
      <div 
        className="relative z-10 w-full max-w-[520px] p-8 border border-[rgba(237,140,45,0.15)] rounded-[30px] bg-white/85 shadow-[0_24px_70px_rgba(237,140,45,0.08),0_10px_30px_rgba(15,23,42,0.04)] backdrop-blur-[18px]"
        style={{ animation: 'auth-rise 620ms ease both' }} // Menyisakan ini jika animasi belum didaftarkan di CSS global
      >
        {/* Card header */}
        <div className="mb-6">
          <p className="mb-3 text-[#ed8c2d] text-[0.82rem] font-extrabold tracking-[0.14em] uppercase">
            Welcome Back
          </p>
          <h1 className="m-0 leading-none text-[clamp(1.9rem,2.8vw,2.4rem)] tracking-tight text-slate-900">
            Masuk
          </h1>
          <p className="mt-3 text-slate-500 leading-relaxed">
            Gunakan akun yang sudah terdaftar untuk masuk ke dashboard.
          </p>
        </div>

        {/* Error alert */}
        {errors.root?.message && (
          <div className="mb-4 py-[0.95rem] px-4 border border-red-500/25 rounded-[18px] bg-red-50/95 text-red-700 text-[0.95rem] leading-normal">
            {errors.root.message}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {/* Email */}
          <FormField label="Email" htmlFor="email" error={errors.email?.message}>
            <Input
              id="email"
              type="email"
              placeholder="nama@contoh.com"
              autoComplete="email"
              disabled={isPending}
              className="min-h-[3.2rem] py-[0.9rem] px-4 border border-slate-200 rounded-[16px] bg-white/96 text-slate-900 text-base"
              {...register('email')}
            />
          </FormField>

          {/* Password */}
          <FormField label="Kata sandi" htmlFor="password" error={errors.password?.message}>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Masukkan kata sandi"
                autoComplete="current-password"
                disabled={isPending}
                className="min-h-[3.2rem] pt-[0.9rem] pb-[0.9rem] pr-12 pl-4 border border-slate-200 rounded-[16px] bg-white/96 text-slate-900 text-base"
                {...register('password')}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                disabled={isPending}
                tabIndex={-1}
                aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                className="absolute top-1/2 -translate-y-1/2 right-3 flex items-center justify-center rounded-full w-[2.1rem] h-[2.1rem] text-slate-500 bg-transparent border-none transition-colors hover:bg-[#ed8c2d] hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </FormField>

          {/* Submit */}
          <Button
            type="submit"
            disabled={isPending}
            className="w-full min-h-[3.4rem] border-none rounded-[16px] bg-gradient-to-br from-[#ed8c2d] to-[#e07b1b] text-white text-[0.98rem] font-bold tracking-wide shadow-[0_16px_28px_rgba(237,140,45,0.25)] transition-all duration-180 ease-out hover:-translate-y-0.5 hover:shadow-[0_18px_32px_rgba(237,140,45,0.35)] hover:brightness-105 disabled:pointer-events-none"
          >
            {isPending ? 'Memproses…' : 'Masuk'}
          </Button>
        </form>
      </div>

      {/* Keyframe — Di Tailwind v4, disarankan ditaruh di file global CSS menggunakan @keyframes */}
      <style>{`
        @keyframes auth-rise {
          from { opacity: 0; transform: translateY(18px) scale(0.985); }
          to   { opacity: 1; transform: translateY(0)    scale(1);     }
        }
      `}</style>
    </main>
  )
}
