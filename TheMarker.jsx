import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { ScrollArea } from '../components/ui/scroll-area';
import { 
    GraduationCap, Lock, Loader2, Send, Sparkles, 
    ArrowRight, MessageCircle, AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function TheMarker() {
    const { user, token } = useAuth();
    const { theme } = useTheme();
    
    const [loading, setLoading] = useState(false);
    const [question, setQuestion] = useState('');
    const [messages, setMessages] = useState([]);

    const isPro = user?.tier === 'pro';
    const hasEducationSetup = user?.country && user?.education_level && user?.exam_board;

    const handleAsk = async () => {
        if (!question.trim()) {
            toast.error('Please enter a question');
            return;
        }

        const userMessage = { role: 'user', content: question };
        setMessages(prev => [...prev, userMessage]);
        setLoading(true);

        try {
            const response = await axios.post(`${API}/the-marker`, {
                question
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const aiMessage = { role: 'assistant', content: response.data.response };
            setMessages(prev => [...prev, aiMessage]);
            setQuestion('');
        } catch (err) {
            toast.error(err.response?.data?.detail || 'Failed to get response');
            setMessages(prev => prev.slice(0, -1)); // Remove user message on error
        } finally {
            setLoading(false);
        }
    };

    // Locked state for non-Pro users
    if (!isPro) {
        return (
            <div className="min-h-screen pt-20 pb-12 px-4 flex items-center justify-center">
                <Card className="glass-card max-w-md w-full text-center relative overflow-hidden">
                    {/* Background glow */}
                    <div className={`absolute inset-0 opacity-20 ${
                        theme === 'dark' 
                            ? 'bg-gradient-to-b from-violet-500/50 to-transparent'
                            : 'bg-gradient-to-b from-cyan-500/50 to-transparent'
                    }`} />
                    
                    <CardContent className="p-10 relative z-10">
                        <div className={`w-20 h-20 rounded-2xl mx-auto mb-6 flex items-center justify-center ${
                            theme === 'dark' ? 'bg-violet-500/20' : 'bg-cyan-500/20'
                        }`}>
                            <Lock className={`h-10 w-10 ${
                                theme === 'dark' ? 'text-violet-400' : 'text-cyan-500'
                            }`} />
                        </div>
                        
                        <h2 className="font-heading text-2xl font-bold mb-2">
                            The Marker AI
                        </h2>
                        <p className="text-muted-foreground mb-6">
                            Get expert feedback on why answers score highly and what's missing for top marks.
                        </p>
                        
                        <div className={`p-4 rounded-xl mb-6 ${
                            theme === 'dark' ? 'bg-violet-500/10' : 'bg-cyan-500/10'
                        }`}>
                            <p className="font-heading font-semibold text-lg">Pro Feature</p>
                            <p className="text-sm text-muted-foreground">£8.99/month</p>
                        </div>

                        <Link to="/upgrade">
                            <Button 
                                size="lg" 
                                className={`rounded-full w-full ${theme === 'dark' ? 'glow-purple' : 'glow-cyan'}`}
                                data-testid="unlock-marker-btn"
                            >
                                <Sparkles className="mr-2 h-5 w-5" />
                                Unlock The Marker AI
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Setup required
    if (!hasEducationSetup) {
        return (
            <div className="min-h-screen pt-20 pb-12 px-4 flex items-center justify-center">
                <Card className="glass-card max-w-md w-full text-center">
                    <CardContent className="p-8">
                        <AlertCircle className={`h-12 w-12 mx-auto mb-4 ${
                            theme === 'dark' ? 'text-violet-400' : 'text-cyan-500'
                        }`} />
                        <h2 className="font-heading text-xl font-semibold mb-2">Setup Required</h2>
                        <p className="text-muted-foreground mb-6">
                            Configure your exam board first so The Marker AI can give board-specific feedback.
                        </p>
                        <Link to="/settings">
                            <Button className="rounded-full" data-testid="marker-go-settings-btn">
                                Go to Settings
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-20 pb-12 px-4">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 ${
                        theme === 'dark' ? 'bg-violet-500/10 text-violet-400' : 'bg-cyan-500/10 text-cyan-500'
                    }`}>
                        <Sparkles className="h-4 w-4" />
                        <span className="text-sm font-medium">Pro Feature</span>
                    </div>
                    <h1 className="font-heading text-3xl md:text-4xl font-bold mb-2">
                        The Marker AI
                    </h1>
                    <p className="text-muted-foreground">
                        Expert feedback for{' '}
                        <span className={`font-medium ${theme === 'dark' ? 'text-violet-400' : 'text-cyan-500'}`}>
                            {user?.exam_board} {user?.education_level}
                        </span>
                    </p>
                </div>

                {/* Chat Interface */}
                <Card className="glass-card">
                    <CardHeader>
                        <CardTitle className="font-heading flex items-center gap-2">
                            <GraduationCap className={`h-5 w-5 ${
                                theme === 'dark' ? 'text-violet-400' : 'text-cyan-500'
                            }`} />
                            Chat with The Marker AI
                        </CardTitle>
                        <CardDescription>
                            Ask about mark schemes, answer techniques, or how to improve your responses
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Messages */}
                        <ScrollArea className={`h-[400px] p-4 rounded-xl ${
                            theme === 'dark' ? 'bg-black/20' : 'bg-muted/50'
                        }`}>
                            {messages.length === 0 ? (
                                <div className="h-full flex items-center justify-center text-center">
                                    <div>
                                        <MessageCircle className={`h-12 w-12 mx-auto mb-3 opacity-20 ${
                                            theme === 'dark' ? 'text-violet-400' : 'text-cyan-500'
                                        }`} />
                                        <p className="text-muted-foreground text-sm">
                                            Ask The Marker AI anything about exam technique
                                        </p>
                                        <div className="mt-4 space-y-2 text-xs text-muted-foreground/60">
                                            <p>"How do I structure a 12-mark essay?"</p>
                                            <p>"What makes an A* evaluation answer?"</p>
                                            <p>"How do I hit all the assessment objectives?"</p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {messages.map((msg, i) => (
                                        <div
                                            key={i}
                                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div className={`max-w-[85%] p-4 rounded-2xl ${
                                                msg.role === 'user'
                                                    ? theme === 'dark' 
                                                        ? 'bg-violet-500/20 text-foreground' 
                                                        : 'bg-cyan-500/20 text-foreground'
                                                    : 'bg-card border border-border'
                                            }`}>
                                                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                                            </div>
                                        </div>
                                    ))}
                                    {loading && (
                                        <div className="flex justify-start">
                                            <div className="bg-card border border-border p-4 rounded-2xl">
                                                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </ScrollArea>

                        {/* Input */}
                        <div className="flex gap-3">
                            <Textarea
                                placeholder="Ask The Marker AI..."
                                className="min-h-[60px] resize-none flex-1"
                                value={question}
                                onChange={(e) => setQuestion(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleAsk();
                                    }
                                }}
                                data-testid="marker-question-input"
                            />
                            <Button
                                onClick={handleAsk}
                                disabled={loading || !question.trim()}
                                className="rounded-full px-6"
                                data-testid="marker-send-btn"
                            >
                                {loading ? (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                ) : (
                                    <Send className="h-5 w-5" />
                                )}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
