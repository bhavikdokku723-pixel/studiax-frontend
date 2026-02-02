import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Logo } from './Logo';
import { Button } from './ui/button';
import { Sun, Moon, LogOut, User } from 'lucide-react';

export const Navbar = () => {
    const { theme, toggleTheme } = useTheme();
    const { user, logout, isAuthenticated } = useAuth();
    const { t } = useLanguage();
    const location = useLocation();

    const navLinks = [
        { path: '/exam-answer', label: t('nav_examanswer') },
        { path: '/study-tools', label: t('nav_studytools') },
        { path: '/upgrade', label: t('nav_upgrade') },
        { path: '/settings', label: t('nav_settings') },
    ];

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 backdrop-blur-xl bg-background/80">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <Link to="/" className="flex-shrink-0" data-testid="logo-link">
                        <Logo />
                    </Link>

                    <div className="hidden md:flex items-center gap-1">
                        {isAuthenticated && navLinks.map(link => (
                            <Link key={link.path} to={link.path}>
                                <Button
                                    variant={location.pathname === link.path ? 'secondary' : 'ghost'}
                                    size="sm"
                                    data-testid={`nav-${link.path.replace('/', '')}`}
                                >
                                    {link.label}
                                </Button>
                            </Link>
                        ))}
                    </div>

                    <div className="flex items-center gap-3">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={toggleTheme}
                            className="rounded-full"
                            data-testid="theme-toggle"
                        >
                            {theme === 'dark' ? (
                                <Sun className="h-5 w-5 text-yellow-400" />
                            ) : (
                                <Moon className="h-5 w-5 text-slate-700" />
                            )}
                        </Button>

                        {isAuthenticated ? (
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground hidden sm:block">
                                    {user?.name}
                                </span>
                                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                    user?.tier === 'pro' ? 'bg-violet-500/20 text-violet-400' :
                                    user?.tier === 'study_plus' ? 'bg-cyan-500/20 text-cyan-400' :
                                    'bg-muted text-muted-foreground'
                                }`}>
                                    {user?.tier === 'study_plus' ? 'Study+' : user?.tier?.charAt(0).toUpperCase() + user?.tier?.slice(1)}
                                </span>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={logout}
                                    className="rounded-full"
                                    data-testid="logout-btn"
                                >
                                    <LogOut className="h-4 w-4" />
                                </Button>
                            </div>
                        ) : (
                            <Link to="/auth">
                                <Button size="sm" data-testid="login-btn">
                                    <User className="h-4 w-4 mr-2" />
                                    {t('nav_signin')}
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
