'use client';

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "@/lib/auth-client"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"



export default function LoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [rememberMe, setRememberMe] = useState(true)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        try {
            await signIn.email(
                { email, password, rememberMe },
                {
                    onSuccess: () => router.push("/"),
                    onError: (ctx) => {
                        if (ctx.error.status === 403) {
                            setError("Please verify your email address.")
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
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
            <Card className="w-full max-w-md p-6 space-y-6">
                <h2 className="text-2xl font-bold text-center">Login</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <Label htmlFor="password">Password</Label>
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
                        <Label htmlFor="rememberMe">Remember me</Label>
                    </div>
                    {error && (
                        <div className="text-sm text-red-500">{error}</div>
                    )}
                    <Button type="submit" disabled={loading} className="w-full">
                        {loading ? "Signing in..." : "Sign In"}
                    </Button>
                </form>
                <div className="text-center text-sm">
                    <a href="/register" className="text-primary hover:underline">
                        Don't have an account? Sign up
                    </a>
                </div>
                <div className="text-center text-sm">
                    <a href="/reset-password" className="text-muted hover:underline">
                        Forgot password?
                    </a>
                </div>
            </Card>
        </div>
    )
}