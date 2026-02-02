import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { ScrollArea } from '../components/ui/scroll-area';
import { Separator } from '../components/ui/separator';
import { Switch } from '../components/ui/switch';
import { 
    Loader2, PenLine, Sparkles, Copy, Check, BookOpen, 
    AlertCircle, ArrowRight, Lightbulb 
} from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const TASK_TYPES = [
    { value: 'essay', label: 'Essay' },
    { value: 'short_response', label: 'Short Response' },
    { value: 'evaluation', label: 'Evaluation' },
    { value: 'explanation', label: 'Explanation' },
    { value: 'custom', label: 'Custom' }
];

const SUBJECTS = [
    'English Literature', 'English Language', 'Mathematics', 'Physics', 
    'Chemistry', 'Biology', 'History', 'Geography', 'Psychology', 
    'Economics', 'Business Studies', 'Computer Science', 'Art & Design',
    'Music', 'Religious Studies', 'Philosophy', 'Politics', 'Sociology',
    'Languages', 'Physical Education', 'Other'
];

export default function ExamAnswer() {
    const { user, token } = useAuth();
    const { theme } = useTheme();
    
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const [answer, setAnswer] = useState(null);
    
    const [formData, setFormData] = useState({
        subject: '',
        question: '',
        task_type: 'essay',
        marks: '',
        include_insight: false
    });

    const canUseInsight = user?.tier === 'study_plus' || user?.tier === 'pro';
    const hasEducationSetup = user?.country && user?.education_level && user?.exam_board;

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!hasEducationSetup) {
            toast.error('Please set up your education level first');
            return;
        }

        if (!formData.subject || !formData.question.trim()) {
            toast.error('Please fill in subject and question');
            return;
        }

        setLoading(true);
        setAnswer(null);

        try {
            const response = await axios.post(`${API}/exam-answer`, {
                ...formData,
                marks: formData.marks ? parseInt(formData.marks) : null,
                include_insight: canUseInsight && formData.include_insight
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            setAnswer(response.data);
            toast.success('Answer generated!');
        } catch (err) {
            const msg = err.response?.data?.detail || 'Failed to generate answer';
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    const copyAnswer = () => {
        if (answer?.answer) {
            navigator.clipboard.writeText(answer.answer);
            setCopied(true);
            toast.success('Copied to clipboard!');
            setTimeout(() => setCopied(false), 2000);
        }
    };

    if (!hasEducationSetup) {
        return (
            <div className="min-h-screen pt-20 pb-12 px-4 flex items-center justify-center">
                <Card className="glass-card max-w-md w-full text-center">
                    <CardContent className="p-8">
                        <AlertCircle className={`h-12 w-12 mx-auto mb-4 ${theme === 'dark' ? 'text-violet-400' : 'text-cyan-500'}`} />
                        <h2 className="font-heading text-xl font-semibold mb-2">Setup Required</h2>
                        <p className="text-muted-foreground mb-6">
                            Please configure your country, education level, and exam board first.
                        </p>
                        <Link to="/settings">
                            <Button className="rounded-full" data-testid="go-to-settings-btn">
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
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="font-heading text-3xl md:text-4xl font-bold mb-2">
                        ExamAnswer
                    </h1>
                    <p className="text-muted-foreground">
                        Generate exam-board specific answers tailored for{' '}
                        <span className={`font-medium ${theme === 'dark' ? 'text-violet-400' : 'text-cyan-500'}`}>
                            {user?.exam_board}
                        </span>
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-6">
                    {/* Input Form */}
                    <Card className="glass-card">
                        <CardHeader>
                            <CardTitle className="font-heading flex items-center gap-2">
                                <PenLine className={`h-5 w-5 ${theme === 'dark' ? 'text-violet-400' : 'text-cyan-500'}`} />
                                Your Question
                            </CardTitle>
                            <CardDescription>
                                Enter your exam question and we'll generate a model answer
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-5">
                                {/* Subject */}
                                <div className="space-y-2">
                                    <Label>Subject</Label>
                                    <Select
                                        value={formData.subject}
                                        onValueChange={(v) => setFormData({ ...formData, subject: v })}
                                    >
                                        <SelectTrigger data-testid="subject-select">
                                            <SelectValue placeholder="Select subject" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {SUBJECTS.map((s) => (
                                                <SelectItem key={s} value={s}>{s}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Task Type */}
                                <div className="space-y-2">
                                    <Label>Task Type</Label>
                                    <Select
                                        value={formData.task_type}
                                        onValueChange={(v) => setFormData({ ...formData, task_type: v })}
                                    >
                                        <SelectTrigger data-testid="task-type-select">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {TASK_TYPES.map((t) => (
                                                <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Question */}
                                <div className="space-y-2">
                                    <Label>Question</Label>
                                    <Textarea
                                        placeholder="Type or paste your exam question here..."
                                        className="min-h-[150px] resize-none"
                                        value={formData.question}
                                        onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                                        data-testid="question-input"
                                    />
                                </div>

                                {/* Marks */}
                                <div className="space-y-2">
                                    <Label>Marks (optional)</Label>
                                    <Input
                                        type="number"
                                        placeholder="e.g. 8"
                                        min="1"
                                        max="100"
                                        value={formData.marks}
                                        onChange={(e) => setFormData({ ...formData, marks: e.target.value })}
                                        data-testid="marks-input"
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        How many marks is this question worth?
                                    </p>
                                </div>

                                {/* Examiner Insight Toggle */}
                                <div className={`flex items-center justify-between p-4 rounded-xl ${
                                    canUseInsight 
                                        ? theme === 'dark' ? 'bg-violet-500/10' : 'bg-cyan-500/10'
                                        : 'bg-muted'
                                }`}>
                                    <div className="flex items-center gap-3">
                                        <Lightbulb className={`h-5 w-5 ${
                                            canUseInsight 
                                                ? theme === 'dark' ? 'text-violet-400' : 'text-cyan-500'
                                                : 'text-muted-foreground'
                                        }`} />
                                        <div>
                                            <p className="font-medium text-sm">Examiner Insight</p>
                                            <p className="text-xs text-muted-foreground">
                                                {canUseInsight 
                                                    ? 'Get grade prediction and improvement tips'
                                                    : 'Requires Study+ or Pro tier'}
                                            </p>
                                        </div>
                                    </div>
                                    <Switch
                                        checked={formData.include_insight}
                                        onCheckedChange={(v) => setFormData({ ...formData, include_insight: v })}
                                        disabled={!canUseInsight}
                                        data-testid="insight-toggle"
                                    />
                                </div>

                                <Button 
                                    type="submit" 
                                    className="w-full rounded-full py-6"
                                    disabled={loading}
                                    data-testid="generate-answer-btn"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                            Generating...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="mr-2 h-5 w-5" />
                                            Generate Answer
                                        </>
                                    )}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Answer Output */}
                    <Card className={`glass-card ${answer ? theme === 'dark' ? 'glow-purple' : 'glow-cyan' : ''}`}>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="font-heading flex items-center gap-2">
                                    <BookOpen className={`h-5 w-5 ${theme === 'dark' ? 'text-violet-400' : 'text-cyan-500'}`} />
                                    Model Answer
                                </CardTitle>
                                {answer && (
                                    <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        onClick={copyAnswer}
                                        data-testid="copy-answer-btn"
                                    >
                                        {copied ? (
                                            <Check className="h-4 w-4 text-green-500" />
                                        ) : (
                                            <Copy className="h-4 w-4" />
                                        )}
                                    </Button>
                                )}
                            </div>
                            {answer && (
                                <CardDescription>
                                    {answer.subject} • {TASK_TYPES.find(t => t.value === answer.task_type)?.label}
                                    {answer.marks && ` • ${answer.marks} marks`}
                                </CardDescription>
                            )}
                        </CardHeader>
                        <CardContent>
                            {answer ? (
                                <ScrollArea className="h-[500px] pr-4">
                                    <div className="space-y-6">
                                        {/* Answer Text */}
                                        <div className="prose prose-sm dark:prose-invert max-w-none">
                                            <div className="whitespace-pre-wrap font-body text-foreground leading-relaxed">
                                                {answer.answer}
                                            </div>
                                        </div>

                                        {/* Examiner Insight */}
                                        {answer.insight && (
                                            <>
                                                <Separator />
                                                <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-violet-500/10' : 'bg-cyan-500/10'}`}>
                                                    <div className="flex items-center gap-2 mb-3">
                                                        <Lightbulb className={`h-4 w-4 ${theme === 'dark' ? 'text-violet-400' : 'text-cyan-500'}`} />
                                                        <span className="font-heading font-semibold text-sm">Examiner Insight</span>
                                                    </div>
                                                    <div className="text-sm whitespace-pre-wrap text-muted-foreground">
                                                        {answer.insight}
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </ScrollArea>
                            ) : (
                                <div className="h-[500px] flex items-center justify-center text-center">
                                    <div>
                                        <PenLine className={`h-16 w-16 mx-auto mb-4 opacity-20 ${theme === 'dark' ? 'text-violet-400' : 'text-cyan-500'}`} />
                                        <p className="text-muted-foreground">
                                            Your model answer will appear here
                                        </p>
                                        <p className="text-sm text-muted-foreground/60 mt-2">
                                            Enter your question and click Generate
                                        </p>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
