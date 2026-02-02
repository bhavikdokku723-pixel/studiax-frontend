import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../components/ui/dialog';
import { Slider } from '../components/ui/slider';
import { 
    FileText, BookMarked, GraduationCap, Lock, Loader2, 
    Sparkles, ArrowRight, RotateCcw, ChevronLeft, ChevronRight, Copy, Check,
    Info, CheckCircle
} from 'lucide-react';
import { toast } from 'sonner';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

// Flashcard Component with flip animation
function Flashcard({ question, answer, isFlipped, onFlip }) {
    const { theme } = useTheme();
    
    return (
        <div 
            className="relative w-full h-64 cursor-pointer perspective-1000"
            onClick={onFlip}
            data-testid="flashcard"
        >
            <div className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${
                isFlipped ? 'rotate-y-180' : ''
            }`}>
                {/* Front - Question */}
                <div className={`absolute inset-0 backface-hidden rounded-xl border p-6 flex flex-col items-center justify-center text-center ${
                    theme === 'dark' 
                        ? 'bg-violet-500/10 border-violet-500/30' 
                        : 'bg-cyan-500/10 border-cyan-500/30'
                }`}>
                    <span className={`text-xs uppercase tracking-wide mb-3 ${
                        theme === 'dark' ? 'text-violet-400' : 'text-cyan-500'
                    }`}>Question</span>
                    <p className="font-heading text-lg font-semibold">{question}</p>
                    <span className="text-xs text-muted-foreground mt-4">Click to reveal answer</span>
                </div>
                
                {/* Back - Answer */}
                <div className={`absolute inset-0 backface-hidden rotate-y-180 rounded-xl border p-6 flex flex-col items-center justify-center text-center ${
                    theme === 'dark' 
                        ? 'bg-card border-border' 
                        : 'bg-card border-border'
                }`}>
                    <span className={`text-xs uppercase tracking-wide mb-3 ${
                        theme === 'dark' ? 'text-violet-400' : 'text-cyan-500'
                    }`}>Answer</span>
                    <p className="text-base">{answer}</p>
                    <span className="text-xs text-muted-foreground mt-4">Click to see question</span>
                </div>
            </div>
        </div>
    );
}

// Flashcards Study Mode Component
function FlashcardsStudyMode({ flashcards, theme }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [flippedCards, setFlippedCards] = useState({});

    const toggleFlip = () => {
        setFlippedCards(prev => ({
            ...prev,
            [currentIndex]: !prev[currentIndex]
        }));
    };

    const goNext = () => {
        if (currentIndex < flashcards.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const goPrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    const resetAll = () => {
        setFlippedCards({});
        setCurrentIndex(0);
    };

    const currentCard = flashcards[currentIndex];

    return (
        <div className="space-y-6">
            {/* Progress */}
            <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                    Card {currentIndex + 1} of {flashcards.length}
                </span>
                <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={resetAll}
                    data-testid="reset-flashcards-btn"
                >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset
                </Button>
            </div>

            {/* Progress bar */}
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div 
                    className={`h-full transition-all duration-300 ${
                        theme === 'dark' ? 'bg-violet-500' : 'bg-cyan-500'
                    }`}
                    style={{ width: `${((currentIndex + 1) / flashcards.length) * 100}%` }}
                />
            </div>

            {/* Flashcard */}
            <Flashcard
                question={currentCard.question}
                answer={currentCard.answer}
                isFlipped={flippedCards[currentIndex] || false}
                onFlip={toggleFlip}
            />

            {/* Navigation */}
            <div className="flex items-center justify-between">
                <Button
                    variant="outline"
                    onClick={goPrev}
                    disabled={currentIndex === 0}
                    data-testid="prev-card-btn"
                >
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Previous
                </Button>
                <Button
                    variant="outline"
                    onClick={goNext}
                    disabled={currentIndex === flashcards.length - 1}
                    data-testid="next-card-btn"
                >
                    Next
                    <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
            </div>

            {/* Card list preview */}
            <div className="flex gap-2 justify-center flex-wrap">
                {flashcards.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        className={`w-3 h-3 rounded-full transition-all ${
                            idx === currentIndex 
                                ? theme === 'dark' ? 'bg-violet-500' : 'bg-cyan-500'
                                : 'bg-muted hover:bg-muted-foreground/30'
                        }`}
                        data-testid={`card-dot-${idx}`}
                    />
                ))}
            </div>
        </div>
    );
}

export default function StudyTools() {
    const { user, token } = useAuth();
    const { theme } = useTheme();
    const { t } = useLanguage();
    
    const [activeModal, setActiveModal] = useState(null);
    const [loading, setLoading] = useState(false);
    
    // Flashcards state
    const [flashcardsTopic, setFlashcardsTopic] = useState('');
    const [flashcardsSubject, setFlashcardsSubject] = useState('');
    const [flashcardsCount, setFlashcardsCount] = useState(5);
    const [flashcardsData, setFlashcardsData] = useState([]);
    const [studyMode, setStudyMode] = useState(false);
    
    // YouTube Transcript state
    const [transcript, setTranscript] = useState('');
    const [generatedNotes, setGeneratedNotes] = useState('');
    const [copied, setCopied] = useState(false);

    const isPremium = user?.tier === 'study_plus' || user?.tier === 'pro';
    const isPro = user?.tier === 'pro';

    const tools = [
        {
            id: 'transcript',
            title: 'YouTube Transcript → Notes',
            description: 'Convert video transcripts into structured study notes',
            icon: FileText,
            tier: 'study_plus',
            price: '£2.99',
            locked: !isPremium,
            onClick: () => setActiveModal('transcript')
        },
        {
            id: 'flashcards',
            title: t('tools_flashcards_title'),
            description: t('tools_flashcards_desc'),
            icon: BookMarked,
            tier: 'study_plus',
            price: '£2.99',
            locked: !isPremium,
            onClick: () => setActiveModal('flashcards')
        },
        {
            id: 'marker',
            title: t('tools_marker_title'),
            description: t('tools_marker_desc'),
            icon: GraduationCap,
            tier: 'pro',
            price: '£8.99',
            locked: !isPro,
            onClick: () => window.location.href = '/the-marker'
        }
    ];

    const handleFlashcardsGenerate = async () => {
        if (!flashcardsTopic.trim() || !flashcardsSubject.trim()) {
            toast.error('Please enter both subject and topic');
            return;
        }

        setLoading(true);
        setFlashcardsData([]);
        setStudyMode(false);

        try {
            const response = await axios.post(`${API}/study-tools/flashcards`, {
                topic: flashcardsTopic,
                subject: flashcardsSubject,
                count: flashcardsCount
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            setFlashcardsData(response.data.flashcards);
            setStudyMode(true);
            toast.success(`Generated ${response.data.flashcards.length} flashcards!`);
        } catch (err) {
            toast.error(err.response?.data?.detail || 'Failed to generate flashcards');
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateNotes = async () => {
        if (!transcript.trim()) {
            toast.error('Please paste a transcript first');
            return;
        }

        setLoading(true);
        setGeneratedNotes('');

        try {
            const response = await axios.post(`${API}/study-tools/youtube-notes`, {
                transcript: transcript
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            setGeneratedNotes(response.data.notes);
            toast.success('Notes generated successfully!');
        } catch (err) {
            toast.error(err.response?.data?.detail || 'Failed to generate notes');
        } finally {
            setLoading(false);
        }
    };

    const copyNotes = () => {
        if (generatedNotes) {
            navigator.clipboard.writeText(generatedNotes);
            setCopied(true);
            toast.success(t('common_copied'));
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const closeModal = () => {
        setActiveModal(null);
        setFlashcardsData([]);
        setFlashcardsTopic('');
        setFlashcardsSubject('');
        setFlashcardsCount(5);
        setStudyMode(false);
        setTranscript('');
        setGeneratedNotes('');
    };

    return (
        <div className="min-h-screen pt-20 pb-12 px-4">
            {/* CSS for 3D flip effect */}
            <style>{`
                .perspective-1000 { perspective: 1000px; }
                .transform-style-3d { transform-style: preserve-3d; }
                .backface-hidden { backface-visibility: hidden; }
                .rotate-y-180 { transform: rotateY(180deg); }
            `}</style>

            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="font-heading text-3xl md:text-4xl font-bold mb-2">
                        {t('tools_title')}
                    </h1>
                    <p className="text-muted-foreground">
                        {t('tools_subtitle')}
                    </p>
                </div>

                {/* Tools Grid */}
                <div className="grid md:grid-cols-3 gap-6">
                    {tools.map((tool) => (
                        <Card 
                            key={tool.id}
                            className={`glass-card relative overflow-hidden group cursor-pointer transition-all duration-300 ${
                                tool.locked ? 'opacity-80' : 'hover:border-primary/50'
                            }`}
                            onClick={tool.locked ? undefined : tool.onClick}
                            data-testid={`tool-${tool.id}`}
                        >
                            {/* Lock Overlay */}
                            {tool.locked && (
                                <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
                                    <Lock className="h-8 w-8 text-muted-foreground mb-3" />
                                    <span className="text-sm font-medium text-muted-foreground mb-2">
                                        {tool.tier === 'pro' ? 'Pro' : 'Study+'} {t('tools_required')}
                                    </span>
                                    <Link to="/upgrade">
                                        <Button 
                                            size="sm" 
                                            className="rounded-full"
                                            data-testid={`unlock-${tool.id}-btn`}
                                        >
                                            {t('tools_unlock')} {tool.price}/mo
                                        </Button>
                                    </Link>
                                </div>
                            )}

                            <CardHeader className="pb-2">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${
                                    theme === 'dark' ? 'bg-violet-500/10' : 'bg-cyan-500/10'
                                }`}>
                                    <tool.icon className={`h-6 w-6 ${
                                        theme === 'dark' ? 'text-violet-400' : 'text-cyan-500'
                                    }`} />
                                </div>
                                <CardTitle className="font-heading text-lg">{tool.title}</CardTitle>
                                <CardDescription className="text-sm">
                                    {tool.description}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="pt-0">
                                <div className="flex items-center justify-between">
                                    <span className={`text-xs px-2 py-1 rounded-full ${
                                        tool.tier === 'pro' 
                                            ? 'bg-violet-500/20 text-violet-400'
                                            : 'bg-cyan-500/20 text-cyan-400'
                                    }`}>
                                        {tool.tier === 'pro' ? 'Pro' : 'Study+'}
                                    </span>
                                    {!tool.locked && (
                                        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Upgrade CTA for Free Users */}
                {user?.tier === 'free' && (
                    <Card className={`mt-12 glass-card ${theme === 'dark' ? 'glow-purple' : 'glow-cyan'}`}>
                        <CardContent className="p-8 text-center">
                            <Sparkles className={`h-10 w-10 mx-auto mb-4 ${
                                theme === 'dark' ? 'text-violet-400' : 'text-cyan-500'
                            }`} />
                            <h3 className="font-heading text-xl font-semibold mb-2">
                                {t('tools_unlock_all')}
                            </h3>
                            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                                {t('tools_unlock_message')}
                            </p>
                            <Link to="/upgrade">
                                <Button className="rounded-full" data-testid="upgrade-cta-btn">
                                    {t('landing_cta_plans')}
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* YouTube Transcript → Notes Modal */}
            <Dialog open={activeModal === 'transcript'} onOpenChange={(open) => !open && closeModal()}>
                <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
                    <DialogHeader>
                        <DialogTitle className="font-heading flex items-center gap-2">
                            <FileText className={`h-5 w-5 ${theme === 'dark' ? 'text-violet-400' : 'text-cyan-500'}`} />
                            YouTube Transcript → Notes
                        </DialogTitle>
                        <DialogDescription>
                            Paste the YouTube transcript here. The AI will convert it into clean, structured study notes.
                        </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4 py-4 flex-1 overflow-hidden flex flex-col">
                        {/* Instructions Box */}
                        <div className={`p-4 rounded-xl ${
                            theme === 'dark' ? 'bg-violet-500/5 border border-violet-500/20' : 'bg-cyan-500/5 border border-cyan-500/20'
                        }`}>
                            <div className="flex items-start gap-3">
                                <Info className={`h-5 w-5 flex-shrink-0 mt-0.5 ${
                                    theme === 'dark' ? 'text-violet-400' : 'text-cyan-500'
                                }`} />
                                <div className="text-sm">
                                    <p className="font-medium mb-2">How to get the transcript from YouTube:</p>
                                    <ol className="space-y-1 text-muted-foreground">
                                        <li className="flex items-start gap-2">
                                            <span className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                                                theme === 'dark' ? 'bg-violet-500/20 text-violet-400' : 'bg-cyan-500/20 text-cyan-500'
                                            }`}>1</span>
                                            Open the YouTube video
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                                                theme === 'dark' ? 'bg-violet-500/20 text-violet-400' : 'bg-cyan-500/20 text-cyan-500'
                                            }`}>2</span>
                                            Click the three dots ( ⋮ ) below the video title
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                                                theme === 'dark' ? 'bg-violet-500/20 text-violet-400' : 'bg-cyan-500/20 text-cyan-500'
                                            }`}>3</span>
                                            Select "Open Transcript"
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                                                theme === 'dark' ? 'bg-violet-500/20 text-violet-400' : 'bg-cyan-500/20 text-cyan-500'
                                            }`}>4</span>
                                            Copy the entire transcript text
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                                                theme === 'dark' ? 'bg-violet-500/20 text-violet-400' : 'bg-cyan-500/20 text-cyan-500'
                                            }`}>5</span>
                                            Paste it below and click "Generate Notes"
                                        </li>
                                    </ol>
                                </div>
                            </div>
                        </div>

                        {/* Transcript Input */}
                        {!generatedNotes && (
                            <>
                                <div className="space-y-2 flex-1">
                                    <Label>Paste Transcript</Label>
                                    <Textarea
                                        placeholder="Paste the YouTube transcript here..."
                                        value={transcript}
                                        onChange={(e) => setTranscript(e.target.value)}
                                        className="min-h-[200px] resize-none flex-1"
                                        data-testid="transcript-input"
                                    />
                                </div>

                                <Button 
                                    onClick={handleGenerateNotes}
                                    disabled={loading || !transcript.trim()}
                                    className="w-full rounded-full"
                                    data-testid="generate-notes-btn"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Generating notes...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="mr-2 h-4 w-4" />
                                            Generate Notes
                                        </>
                                    )}
                                </Button>
                            </>
                        )}

                        {/* Generated Notes Output */}
                        {generatedNotes && (
                            <div className="flex-1 overflow-hidden flex flex-col min-h-0">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className={`h-4 w-4 ${theme === 'dark' ? 'text-violet-400' : 'text-cyan-500'}`} />
                                        <Label>Generated Notes</Label>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={copyNotes}
                                        data-testid="copy-notes-btn"
                                    >
                                        {copied ? (
                                            <Check className="h-4 w-4 text-green-500" />
                                        ) : (
                                            <Copy className="h-4 w-4" />
                                        )}
                                    </Button>
                                </div>
                                <div className={`flex-1 p-4 rounded-xl overflow-y-auto ${
                                    theme === 'dark' ? 'bg-black/20' : 'bg-muted/50'
                                }`} style={{ maxHeight: '50vh', minHeight: '200px' }}>
                                    <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">
                                        {generatedNotes}
                                    </div>
                                </div>
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setGeneratedNotes('');
                                        setTranscript('');
                                    }}
                                    className="w-full mt-4 rounded-full"
                                    data-testid="new-notes-btn"
                                >
                                    Generate New Notes
                                </Button>
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            {/* Flashcards Modal */}
            <Dialog open={activeModal === 'flashcards'} onOpenChange={(open) => !open && closeModal()}>
                <DialogContent className="sm:max-w-xl">
                    <DialogHeader>
                        <DialogTitle className="font-heading flex items-center gap-2">
                            <BookMarked className={`h-5 w-5 ${theme === 'dark' ? 'text-violet-400' : 'text-cyan-500'}`} />
                            {studyMode ? t('flashcards_study_title') : t('flashcards_title')}
                        </DialogTitle>
                        <DialogDescription>
                            {studyMode 
                                ? t('flashcards_study_subtitle')
                                : t('flashcards_subtitle')}
                        </DialogDescription>
                    </DialogHeader>
                    
                    {!studyMode ? (
                        <div className="space-y-5 py-4">
                            <div className="space-y-2">
                                <Label>{t('flashcards_subject')}</Label>
                                <Input
                                    placeholder={t('flashcards_subject_placeholder')}
                                    value={flashcardsSubject}
                                    onChange={(e) => setFlashcardsSubject(e.target.value)}
                                    data-testid="flashcards-subject-input"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>{t('flashcards_topic')}</Label>
                                <Input
                                    placeholder={t('flashcards_topic_placeholder')}
                                    value={flashcardsTopic}
                                    onChange={(e) => setFlashcardsTopic(e.target.value)}
                                    data-testid="flashcards-topic-input"
                                />
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <Label>{t('flashcards_count')}</Label>
                                    <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                                        theme === 'dark' ? 'bg-violet-500/20 text-violet-400' : 'bg-cyan-500/20 text-cyan-500'
                                    }`}>
                                        {flashcardsCount}
                                    </span>
                                </div>
                                <Slider
                                    value={[flashcardsCount]}
                                    onValueChange={(value) => setFlashcardsCount(value[0])}
                                    min={1}
                                    max={100}
                                    step={1}
                                    className="w-full"
                                    data-testid="flashcards-count-slider"
                                />
                                <div className="flex justify-between text-xs text-muted-foreground">
                                    <span>1</span>
                                    <span>{t('flashcards_max')}</span>
                                </div>
                            </div>
                            <Button 
                                onClick={handleFlashcardsGenerate}
                                disabled={loading}
                                className="w-full rounded-full"
                                data-testid="flashcards-generate-btn"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        {t('flashcards_generating')} {flashcardsCount} flashcards...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="mr-2 h-4 w-4" />
                                        {t('flashcards_generate')} {flashcardsCount} Flashcards
                                    </>
                                )}
                            </Button>
                        </div>
                    ) : (
                        <div className="py-4">
                            <FlashcardsStudyMode 
                                flashcards={flashcardsData} 
                                theme={theme}
                            />
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setStudyMode(false);
                                    setFlashcardsData([]);
                                }}
                                className="w-full mt-4 rounded-full"
                                data-testid="new-flashcards-btn"
                            >
                                {t('flashcards_new')}
                            </Button>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
