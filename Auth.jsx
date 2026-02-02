import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Logo } from '../components/Logo';
import { Loader2, Mail, Lock, User } from 'lucide-react';

export default function Auth() {
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: ''
    });

    const { login, register } = useAuth();
    const { theme } = useTheme();
    const { t } = useLanguage();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isLogin) {
                await login(formData.email, formData.password);
            } else {
                await register(formData.email, formData.password, formData.name);
            }
            navigate('/settings');
        } catch (err) {
            setError(err.response?.data?.detail || t('common_error'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-16">
            <div 
                className="absolute inset-0 -z-10"
                style={{
                    background: theme === 'dark' 
                        ? 'radial-gradient(circle at 50% 30%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)'
                        : 'radial-gradient(circle at 50% 30%, rgba(6, 182, 212, 0.08) 0%, transparent 50%)'
                }}
            />

            <Card className="w-full max-w-md glass-card">
                <CardHeader className="text-center pb-2">
                    <div className="flex justify-center mb-4">
                        <Logo size="large" />
                    </div>
                    <CardTitle className="font-heading text-2xl">
                        {isLogin ? t('auth_welcome') : t('auth_create')}
                    </CardTitle>
                    <CardDescription>
                        {isLogin 
                            ? t('auth_signin_subtitle')
                            : t('auth_signup_subtitle')}
                    </CardDescription>
                </CardHeader>

                <CardContent className="pt-4">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {!isLogin && (
                            <div className="space-y-2">
                                <Label htmlFor="name">{t('auth_name')}</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="name"
                                        type="text"
                                        placeholder={t('auth_name_placeholder')}
                                        className="pl-10"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required={!isLogin}
                                        data-testid="name-input"
                                    />
                                </div>
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="email">{t('auth_email')}</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder={t('auth_email_placeholder')}
                                    className="pl-10"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                    data-testid="email-input"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">{t('auth_password')}</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    className="pl-10"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required
                                    data-testid="password-input"
                                />
                            </div>
                        </div>

                        {error && (
                            <p className="text-sm text-destructive text-center" data-testid="auth-error">
                                {error}
                            </p>
                        )}

                        <Button 
                            type="submit" 
                            className="w-full rounded-full" 
                            disabled={loading}
                            data-testid="auth-submit-btn"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    {isLogin ? t('auth_signing_in') : t('auth_creating')}
                                </>
                            ) : (
                                isLogin ? t('auth_signin_btn') : t('auth_signup_btn')
                            )}
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <button
                            type="button"
                            onClick={() => {
                                setIsLogin(!isLogin);
                                setError('');
                            }}
                            className="text-sm text-muted-foreground hover:text-primary transition-colors"
                            data-testid="toggle-auth-mode"
                        >
                            {isLogin 
                                ? t('auth_no_account')
                                : t('auth_have_account')}
                        </button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
