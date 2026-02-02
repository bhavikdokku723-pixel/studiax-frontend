import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Check, Sparkles, Zap } from 'lucide-react';
import { toast } from 'sonner';

const FREE_FEATURES = [
    { text: 'Basic ExamAnswer', included: true },
    { text: 'Limited subjects', included: true },
    { text: 'No answer history', included: false },
    { text: 'No Examiner Insight', included: false },
    { text: 'No Study Tools', included: false },
    { text: 'No AI Tutor', included: false }
];

const STUDY_PLUS_FEATURES = [
    { text: 'Full ExamAnswer', included: true },
    { text: 'Multi-subject support', included: true },
    { text: 'YouTube → Notes', included: true },
    { text: 'Flashcard Generator', included: true },
    { text: 'Save & history', included: true },
    { text: 'No AI Tutor', included: false }
];

const PRO_FEATURES = [
    { text: 'Full ExamAnswer', included: true },
    { text: 'Examiner Insight', included: true },
    { text: 'All Study+ tools', included: true },
    { text: 'AI Tutor — The Marker', included: true },
    { text: 'Full answer history', included: true },
    { text: 'Priority support', included: true }
];

function FeatureList({ features, theme }) {
    return (
        <ul className="space-y-3">
            {features.map((feature, i) => (
                <li key={i} className="flex items-center gap-3">
                    <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
                        feature.included 
                            ? theme === 'dark' ? 'bg-violet-500/20 text-violet-400' : 'bg-cyan-500/20 text-cyan-500'
                            : 'bg-muted text-muted-foreground'
                    }`}>
                        {feature.included ? (
                            <Check className="h-3 w-3" />
                        ) : (
                            <span className="text-xs">—</span>
                        )}
                    </div>
                    <span className={`text-sm ${!feature.included ? 'text-muted-foreground' : ''}`}>
                        {feature.text}
                    </span>
                </li>
            ))}
        </ul>
    );
}

export default function Upgrade() {
    const { user, upgradeTier, isAuthenticated } = useAuth();
    const { theme } = useTheme();
    const navigate = useNavigate();

    const handleUpgrade = async (tierId) => {
        if (!isAuthenticated) {
            navigate('/auth');
            return;
        }

        if (tierId === user?.tier) {
            toast.info('You are already on this plan');
            return;
        }

        try {
            await upgradeTier(tierId);
            const tierName = tierId === 'study_plus' ? 'Study+' : 'Pro';
            toast.success(`Successfully upgraded to ${tierName}!`);
        } catch (err) {
            toast.error('Upgrade failed. Please try again.');
        }
    };

    const currentTier = user?.tier || 'free';

    return (
        <div className="min-h-screen pt-20 pb-12 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 ${
                        theme === 'dark' ? 'bg-violet-500/10 text-violet-400' : 'bg-cyan-500/10 text-cyan-500'
                    }`}>
                        <Zap className="h-4 w-4" />
                        <span className="text-sm font-medium">Choose Your Plan</span>
                    </div>
                    <h1 className="font-heading text-3xl md:text-5xl font-bold mb-4">
                        Upgrade Your Exam Prep
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                        Unlock powerful features to write answers that examiners reward
                    </p>
                </div>

                {/* Pricing Cards */}
                <div className="grid md:grid-cols-3 gap-6">
                    {/* Free Tier */}
                    <Card 
                        className={`glass-card relative overflow-hidden ${currentTier === 'free' ? 'ring-2 ring-primary/50' : ''}`}
                        data-testid="tier-free"
                    >
                        <CardHeader className="pb-2">
                            <CardTitle className="font-heading text-xl">Free</CardTitle>
                            <CardDescription>Get started with basic exam answers</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div>
                                <span className="font-heading text-4xl font-bold">£0</span>
                                <span className="text-muted-foreground text-sm">forever</span>
                            </div>
                            <FeatureList features={FREE_FEATURES} theme={theme} />
                            <Button
                                variant="outline"
                                className="w-full rounded-full"
                                disabled={true}
                                data-testid="upgrade-free-btn"
                            >
                                {currentTier === 'free' ? 'Current Plan' : 'Free Plan'}
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Study+ Tier */}
                    <Card 
                        className={`glass-card relative overflow-hidden ${currentTier === 'study_plus' ? 'ring-2 ring-primary/50' : ''}`}
                        data-testid="tier-study_plus"
                    >
                        <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-medium ${
                            theme === 'dark' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-cyan-500/20 text-cyan-600'
                        }`}>
                            Popular
                        </div>
                        <CardHeader className="pb-2">
                            <CardTitle className="font-heading text-xl">Study+</CardTitle>
                            <CardDescription>Enhanced study tools and multi-subject support</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div>
                                <span className="font-heading text-4xl font-bold">£2.99</span>
                                <span className="text-muted-foreground text-sm">/month</span>
                            </div>
                            <FeatureList features={STUDY_PLUS_FEATURES} theme={theme} />
                            <Button
                                variant={currentTier === 'study_plus' ? 'outline' : 'default'}
                                className="w-full rounded-full"
                                onClick={() => handleUpgrade('study_plus')}
                                disabled={currentTier === 'study_plus'}
                                data-testid="upgrade-study_plus-btn"
                            >
                                {currentTier === 'study_plus' ? 'Current Plan' : 'Upgrade to Study+'}
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Pro Tier */}
                    <Card 
                        className={`glass-card relative overflow-hidden ${
                            theme === 'dark' ? 'border-violet-500/50 glow-purple' : 'border-cyan-500/50 glow-cyan'
                        } ${currentTier === 'pro' ? 'ring-2 ring-primary/50' : ''}`}
                        data-testid="tier-pro"
                    >
                        <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-medium ${
                            theme === 'dark' ? 'bg-violet-500/20 text-violet-400' : 'bg-cyan-500/20 text-cyan-600'
                        }`}>
                            Best Value
                        </div>
                        <CardHeader className="pb-2">
                            <CardTitle className="font-heading text-xl">Pro</CardTitle>
                            <CardDescription>Everything plus AI Tutor for exam mastery</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div>
                                <span className="font-heading text-4xl font-bold">£8.99</span>
                                <span className="text-muted-foreground text-sm">/month</span>
                            </div>
                            <FeatureList features={PRO_FEATURES} theme={theme} />
                            <Button
                                variant={currentTier === 'pro' ? 'outline' : 'default'}
                                className={`w-full rounded-full ${
                                    currentTier !== 'pro' ? (theme === 'dark' ? 'glow-purple' : 'glow-cyan') : ''
                                }`}
                                onClick={() => handleUpgrade('pro')}
                                disabled={currentTier === 'pro'}
                                data-testid="upgrade-pro-btn"
                            >
                                {currentTier === 'pro' ? 'Current Plan' : 'Upgrade to Pro'}
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Note */}
                <p className="text-center text-sm text-muted-foreground mt-8">
                    All plans include access to our core ExamAnswer feature. 
                    Cancel anytime — no questions asked.
                </p>

                {/* Mock payment notice */}
                <div className={`mt-6 text-center p-4 rounded-xl ${
                    theme === 'dark' ? 'bg-violet-500/5' : 'bg-cyan-500/5'
                }`}>
                    <p className="text-xs text-muted-foreground">
                        Demo mode: Upgrades are simulated. Payment integration available on request.
                    </p>
                </div>
            </div>
        </div>
    );
}
