import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { PenLine, BookOpen, Sparkles, Settings, ArrowRight, CheckCircle } from 'lucide-react';

export default function Landing() {
    const { theme } = useTheme();
    const { isAuthenticated } = useAuth();
    const { t } = useLanguage();

    const features = [
        {
            icon: PenLine,
            title: t('nav_examanswer'),
            description: t('tools_youtube_desc').replace('YouTube videos', 'questions'),
            path: '/exam-answer',
            color: theme === 'dark' ? 'text-violet-400' : 'text-cyan-500'
        },
        {
            icon: BookOpen,
            title: t('nav_studytools'),
            description: t('tools_flashcards_desc'),
            path: '/study-tools',
            color: theme === 'dark' ? 'text-violet-400' : 'text-cyan-500'
        },
        {
            icon: Sparkles,
            title: t('nav_upgrade'),
            description: t('tools_marker_desc'),
            path: '/upgrade',
            color: theme === 'dark' ? 'text-violet-400' : 'text-cyan-500'
        },
        {
            icon: Settings,
            title: t('nav_settings'),
            description: t('settings_education_subtitle'),
            path: '/settings',
            color: theme === 'dark' ? 'text-violet-400' : 'text-cyan-500'
        }
    ];

    const benefits = [
        t('landing_benefit_1'),
        t('landing_benefit_2'),
        t('landing_benefit_3'),
        t('landing_benefit_4')
    ];

    return (
        <div className="min-h-screen pt-16">
            {/* Hero Section */}
            <section className="relative overflow-hidden">
                <div 
                    className="absolute inset-0 -z-10"
                    style={{
                        background: theme === 'dark' 
                            ? 'radial-gradient(circle at 50% 0%, rgba(139, 92, 246, 0.15) 0%, transparent 50%)'
                            : 'radial-gradient(circle at 50% 0%, rgba(6, 182, 212, 0.1) 0%, transparent 50%)'
                    }}
                />
                
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
                    <div className="text-center max-w-4xl mx-auto">
                        <h1 className="font-heading text-5xl md:text-7xl font-bold tracking-tight mb-6">
                            {t('landing_hero_title')}{' '}
                            <span className={theme === 'dark' ? 'text-gradient-purple' : 'text-gradient-cyan'}>
                                {t('landing_hero_highlight')}
                            </span>
                        </h1>
                        
                        <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
                            {t('landing_hero_subtitle')}
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link to={isAuthenticated ? '/exam-answer' : '/auth'}>
                                <Button 
                                    size="lg" 
                                    className={`px-8 py-6 text-lg rounded-full ${theme === 'dark' ? 'glow-purple' : 'glow-cyan'}`}
                                    data-testid="get-started-btn"
                                >
                                    {t('landing_cta_start')}
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                            <Link to="/upgrade">
                                <Button 
                                    variant="outline" 
                                    size="lg"
                                    className="px-8 py-6 text-lg rounded-full"
                                    data-testid="view-plans-btn"
                                >
                                    {t('landing_cta_plans')}
                                </Button>
                            </Link>
                        </div>

                        {/* Benefits */}
                        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto text-left">
                            {benefits.map((benefit, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <CheckCircle className={`h-5 w-5 flex-shrink-0 ${theme === 'dark' ? 'text-violet-400' : 'text-cyan-500'}`} />
                                    <span className="text-sm text-muted-foreground">{benefit}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-20 md:py-32">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="font-heading text-3xl md:text-5xl font-semibold tracking-tight mb-4">
                            {t('landing_features_title')}
                        </h2>
                        <p className="text-muted-foreground text-lg">
                            {t('landing_features_subtitle')}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {features.map((feature) => (
                            <Link key={feature.path} to={isAuthenticated ? feature.path : '/auth'}>
                                <Card 
                                    className="group glass-card hover:border-primary/50 transition-all duration-300 cursor-pointer h-full"
                                    data-testid={`feature-${feature.title.toLowerCase().replace(' ', '-')}`}
                                >
                                    <CardContent className="p-8">
                                        <div className="flex items-start gap-4">
                                            <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-violet-500/10' : 'bg-cyan-500/10'}`}>
                                                <feature.icon className={`h-6 w-6 ${feature.color}`} />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-heading text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                                                    {feature.title}
                                                </h3>
                                                <p className="text-muted-foreground">
                                                    {feature.description}
                                                </p>
                                            </div>
                                            <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="min-h-[80vh] flex items-center justify-center px-4 sm:px-6 lg:px-8">
                <Card className={`glass-card ${theme === 'dark' ? 'glow-purple' : 'glow-cyan'} w-full max-w-2xl`}>
                    <CardContent className="p-12 md:p-16 text-center flex flex-col items-center justify-center">
                        <h2 className="font-heading text-3xl md:text-4xl font-semibold mb-4 text-center">
                            {t('landing_cta_title')}
                        </h2>
                        <p className="text-muted-foreground text-lg mb-8 max-w-md text-center">
                            {t('landing_cta_subtitle')}
                        </p>
                        <Link to={isAuthenticated ? '/exam-answer' : '/auth'} className="flex justify-center">
                            <Button 
                                size="lg" 
                                className={`px-8 py-6 text-lg rounded-full ${theme === 'dark' ? 'glow-purple' : 'glow-cyan'}`}
                                data-testid="cta-start-btn"
                            >
                                {t('landing_cta_button')}
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </section>

            {/* Footer */}
            <footer className="border-t border-border/50 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <p className="text-sm text-muted-foreground">
                        © 2025 StudiaX. Exam-focused AI tutoring.
                    </p>
                </div>
            </footer>
        </div>
    );
}
