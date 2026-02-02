import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage, LANGUAGES } from '../context/LanguageContext';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Switch } from '../components/ui/switch';
import { Loader2, Globe, GraduationCap, Award, Sun, Moon, ArrowRight, Languages } from 'lucide-react';
import { toast } from 'sonner';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function Settings() {
    const { user, token, updateUser } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const { language, setLanguage, t } = useLanguage();
    const navigate = useNavigate();
    
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [countries, setCountries] = useState([]);
    const [levels, setLevels] = useState([]);
    const [boards, setBoards] = useState([]);
    
    const [formData, setFormData] = useState({
        country: user?.country || '',
        education_level: user?.education_level || '',
        exam_board: user?.exam_board || '',
        language: user?.language || language || 'en-GB'
    });

    // Sync language from user on mount
    useEffect(() => {
        if (user?.language) {
            setLanguage(user.language);
            setFormData(prev => ({ ...prev, language: user.language }));
        }
    }, [user?.language, setLanguage]);

    // Fetch countries on mount
    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const res = await axios.get(`${API}/education/countries`);
                setCountries(res.data.countries);
            } catch (err) {
                console.error('Failed to fetch countries:', err);
            }
        };
        fetchCountries();
    }, []);

    // Fetch levels when country changes
    useEffect(() => {
        if (formData.country) {
            const fetchLevels = async () => {
                setLoading(true);
                try {
                    const res = await axios.get(`${API}/education/levels/${formData.country}`);
                    setLevels(res.data.levels);
                    if (formData.country !== user?.country) {
                        setFormData(prev => ({ ...prev, education_level: '', exam_board: '' }));
                        setBoards([]);
                    }
                } catch (err) {
                    console.error('Failed to fetch levels:', err);
                } finally {
                    setLoading(false);
                }
            };
            fetchLevels();
        }
    }, [formData.country, user?.country]);

    // Fetch boards when level changes
    useEffect(() => {
        if (formData.country && formData.education_level) {
            const fetchBoards = async () => {
                setLoading(true);
                try {
                    const res = await axios.get(`${API}/education/boards/${formData.country}/${formData.education_level}`);
                    setBoards(res.data.boards);
                    if (formData.education_level !== user?.education_level) {
                        setFormData(prev => ({ ...prev, exam_board: '' }));
                    }
                } catch (err) {
                    console.error('Failed to fetch boards:', err);
                } finally {
                    setLoading(false);
                }
            };
            fetchBoards();
        }
    }, [formData.country, formData.education_level, user?.education_level]);

    // Update language context when language changes in form
    const handleLanguageChange = (newLang) => {
        setFormData(prev => ({ ...prev, language: newLang }));
        setLanguage(newLang); // Immediately update UI language
    };

    const handleSave = async () => {
        if (!formData.country || !formData.education_level || !formData.exam_board) {
            toast.error(t('common_error'));
            return;
        }

        setSaving(true);
        try {
            await axios.post(`${API}/education/setup`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            updateUser(formData);
            toast.success(t('common_success'));
            navigate('/exam-answer');
        } catch (err) {
            toast.error(t('common_error'));
        } finally {
            setSaving(false);
        }
    };

    const isComplete = formData.country && formData.education_level && formData.exam_board;

    return (
        <div className="min-h-screen pt-20 pb-12 px-4">
            <div className="max-w-2xl mx-auto space-y-8">
                {/* Header */}
                <div className="text-center">
                    <h1 className="font-heading text-3xl md:text-4xl font-bold mb-2">{t('settings_title')}</h1>
                    <p className="text-muted-foreground">
                        {t('settings_subtitle')}
                    </p>
                </div>

                {/* Language Card - First so users can change language immediately */}
                <Card className="glass-card">
                    <CardHeader>
                        <CardTitle className="font-heading flex items-center gap-2">
                            <Languages className={`h-5 w-5 ${theme === 'dark' ? 'text-violet-400' : 'text-cyan-500'}`} />
                            {t('settings_language_title')}
                        </CardTitle>
                        <CardDescription>
                            {t('settings_language_subtitle')}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Select
                            value={formData.language}
                            onValueChange={handleLanguageChange}
                        >
                            <SelectTrigger data-testid="language-select">
                                <SelectValue placeholder="Select language" />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.entries(LANGUAGES).map(([code, name]) => (
                                    <SelectItem key={code} value={code}>
                                        {name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </CardContent>
                </Card>

                {/* Education Setup Card */}
                <Card className="glass-card">
                    <CardHeader>
                        <CardTitle className="font-heading flex items-center gap-2">
                            <GraduationCap className={`h-5 w-5 ${theme === 'dark' ? 'text-violet-400' : 'text-cyan-500'}`} />
                            {t('settings_education_title')}
                        </CardTitle>
                        <CardDescription>
                            {t('settings_education_subtitle')}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Country */}
                        <div className="space-y-2">
                            <Label className="flex items-center gap-2">
                                <Globe className="h-4 w-4" />
                                {t('settings_country')}
                            </Label>
                            <Select
                                value={formData.country}
                                onValueChange={(value) => setFormData({ ...formData, country: value })}
                            >
                                <SelectTrigger data-testid="country-select">
                                    <SelectValue placeholder={t('settings_country_placeholder')} />
                                </SelectTrigger>
                                <SelectContent>
                                    {countries.map((country) => (
                                        <SelectItem key={country} value={country}>
                                            {country}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Education Level */}
                        <div className="space-y-2">
                            <Label className="flex items-center gap-2">
                                <GraduationCap className="h-4 w-4" />
                                {t('settings_level')}
                            </Label>
                            <Select
                                value={formData.education_level}
                                onValueChange={(value) => setFormData({ ...formData, education_level: value })}
                                disabled={!formData.country || loading}
                            >
                                <SelectTrigger data-testid="level-select">
                                    <SelectValue placeholder={formData.country ? t('settings_level_placeholder') : t('settings_level_first')} />
                                </SelectTrigger>
                                <SelectContent>
                                    {levels.map((level) => (
                                        <SelectItem key={level} value={level}>
                                            {level}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Exam Board */}
                        <div className="space-y-2">
                            <Label className="flex items-center gap-2">
                                <Award className="h-4 w-4" />
                                {t('settings_board')}
                            </Label>
                            <Select
                                value={formData.exam_board}
                                onValueChange={(value) => setFormData({ ...formData, exam_board: value })}
                                disabled={!formData.education_level || loading}
                            >
                                <SelectTrigger data-testid="board-select">
                                    <SelectValue placeholder={formData.education_level ? t('settings_board_placeholder') : t('settings_board_first')} />
                                </SelectTrigger>
                                <SelectContent>
                                    {boards.map((board) => (
                                        <SelectItem key={board} value={board}>
                                            {board}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Theme Toggle Card */}
                <Card className="glass-card">
                    <CardHeader>
                        <CardTitle className="font-heading flex items-center gap-2">
                            {theme === 'dark' ? (
                                <Moon className="h-5 w-5 text-violet-400" />
                            ) : (
                                <Sun className="h-5 w-5 text-cyan-500" />
                            )}
                            {t('settings_appearance_title')}
                        </CardTitle>
                        <CardDescription>
                            {t('settings_appearance_subtitle')}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Sun className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">{t('settings_light')}</span>
                            </div>
                            <Switch
                                checked={theme === 'dark'}
                                onCheckedChange={toggleTheme}
                                data-testid="theme-switch"
                            />
                            <div className="flex items-center gap-3">
                                <span className="text-sm">{t('settings_dark')}</span>
                                <Moon className="h-4 w-4 text-muted-foreground" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Save Button */}
                <Button 
                    onClick={handleSave} 
                    className="w-full rounded-full py-6"
                    disabled={!isComplete || saving}
                    data-testid="save-settings-btn"
                >
                    {saving ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            {t('settings_saving')}
                        </>
                    ) : (
                        <>
                            {t('settings_save')}
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                    )}
                </Button>

                {/* Current Selection Summary */}
                {isComplete && (
                    <Card className={`border-2 ${theme === 'dark' ? 'border-violet-500/30' : 'border-cyan-500/30'}`}>
                        <CardContent className="p-6">
                            <div className="text-center">
                                <p className="text-sm text-muted-foreground mb-2">{t('settings_summary')}</p>
                                <p className="font-heading text-xl font-semibold">
                                    {formData.country} • {formData.education_level} • {formData.exam_board}
                                </p>
                                <p className="text-sm text-muted-foreground mt-2">
                                    {t('settings_summary_in')} {LANGUAGES[formData.language]}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
