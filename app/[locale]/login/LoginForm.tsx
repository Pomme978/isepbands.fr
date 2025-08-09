// app/[locale]/login/LoginForm.tsx
'use client'

import { use, useState } from "react"
import { useRouter } from 'next/navigation'
import { signIn } from "@/lib/auth-client"
import { Card } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { Button } from "@/components/ui/Button"
import { useI18n, useScopedI18n } from '../../../locales/client'
import BackButton from "@/components/ui/BackButton"


interface LoginFormProps {
  locale: string; 
}

export default function LoginForm({ locale }: LoginFormProps) {
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [rememberMe, setRememberMe] = useState(true)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const t = useI18n();


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        try {
            await signIn.email(
                { email, password, rememberMe },
                {
                    onSuccess: () => router.push("/" + locale),
                    onError: (ctx) => {
                        if (ctx.error.status === 403) {
                            setError(t('auth.login.errors.emailVerification'))
                        } else {
                            setError(ctx.error.message)
                        }
                    },
                }
            )
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 relative">
            {/* Bouton retour en haut à gauche */}
            <div className="absolute top-6 left-6">
                <BackButton variant="ghost"/>
            </div>
            
            <Card className="w-full max-w-md p-6 space-y-6">
                <div className="text-center">
                    <h1 className="text-2xl font-bold">{t('title')}</h1>
                    <h2 className="text-1xl">{t('auth.login.title')}</h2>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="email">{t('auth.login.email')}</Label>
                        <Input
                            id="email"
                            type="email"
                            autoComplete="email"
                            placeholder={t('forms.placeholders.email')}
                            required
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                    </div>
                    
                    <div>
                        <Label htmlFor="password">{t('auth.login.password')}</Label>
                        <Input
                            id="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <input
                            id="rememberMe"
                            type="checkbox"
                            checked={rememberMe}
                            onChange={e => setRememberMe(e.target.checked)}
                            className="accent-primary"
                        />
                        <Label htmlFor="rememberMe">{t('auth.login.remember')}</Label>
                    </div>
                    
                    {error && (
                        <div className="text-sm text-red-500" role="alert">
                            {error}
                        </div>
                    )}
                    
                    <Button type="submit" disabled={loading} className="w-full">
                        {loading ? t('common.status.loading') : t('auth.login.button')}
                    </Button>
                </form>
                
                <div className="space-y-2 text-center text-sm">
                    <div>
                        <a 
                            href={`/${locale}/register`} 
                            className="text-primary hover:underline"
                        >
                            {t('auth.login.noAccount')} {t('auth.login.register')}
                        </a>
                    </div>
                    <div>
                        <a 
                            href={`/${locale}/reset-password`} 
                            className="text-muted-foreground hover:underline"
                        >
                            {t('auth.login.forgot')}
                        </a>
                    </div>
                </div>
            </Card>
        </div>
    )
}