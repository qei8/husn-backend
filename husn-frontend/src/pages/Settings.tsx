import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { 
  ArrowLeft, 
  Lock, 
  Palette, 
  Globe, 
  RotateCcw,
  Save,
  Eye,
  EyeOff,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';

import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Language, translations } from '@/i18n/translations';
import { changePassword } from '@/lib/usersApi'; 

const Settings = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { language, setLanguage } = useLanguage();

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false); 
  
  const [localSettings, setLocalSettings] = useState<{theme: 'dark' | 'light', language: Language}>({
    theme: theme as 'dark' | 'light',
    language: language as Language,
  });

  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: '',
  });

  const localT = (key: string) => {
    return translations[localSettings.language][key as keyof typeof translations['en']] || key;
  };

  const isLocalRTL = localSettings.language === 'ar';

  useEffect(() => {
    document.documentElement.dir = isLocalRTL ? 'rtl' : 'ltr';
  }, [localSettings.language]);

  const handleSaveSettings = () => {
    setTheme(localSettings.theme);
    setLanguage(localSettings.language);
    localStorage.setItem('husn-theme', localSettings.theme);
    localStorage.setItem('husn-language', localSettings.language);
    toast.success(isLocalRTL ? 'تم حفظ الإعدادات بنجاح' : 'Settings saved successfully');
  };

  // --- دالة التحديث المعدلة لضبط "كرم" السيرفر ---
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.new !== passwordData.confirm) {
      toast.error(isLocalRTL ? 'كلمات المرور الجديدة غير متطابقة' : 'New passwords mismatch');
      return;
    }

    if (passwordData.new.length < 6) {
      toast.error(isLocalRTL ? 'يجب أن تكون 6 خانات على الأقل' : 'Must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    try {
      const savedUser = localStorage.getItem("user");
      const user = savedUser ? JSON.parse(savedUser) : null;

      if (!user?.userId) throw new Error("Session expired");

      // نرسل الطلب ونخزن النتيجة في متغير res
      const res = await changePassword(user.userId, passwordData.current, passwordData.new);

      // تشييك إضافي: لو السيرفر رجع success: false أو رسالة خطأ صريحة
      if (res && res.success === false) {
        throw new Error(res.message || "Invalid current password");
      }

      toast.success(isLocalRTL ? 'تم تحديث كلمة المرور بنجاح ✅' : 'Password updated successfully ✅');
      
      // تحديث بيانات المستخدم محلياً
      const updatedUser = { ...user, password: passwordData.new };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      setPasswordData({ current: '', new: '', confirm: '' });
    } catch (error: any) {
      // هنا نمسك أي خطأ يجي من السيرفر (سواء 401 أو رسالة خطأ مبرمجة)
      console.error("Change Password Error:", error);
      toast.error(isLocalRTL ? 'عذراً: كلمة المرور الحالية غير صحيحة' : 'Current password is incorrect');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRevertDefaults = () => {
    setLocalSettings({ theme: 'dark', language: 'en' });
    toast.info(isLocalRTL ? 'تمت العودة للقيم الافتراضية' : 'Restored to defaults');
  };

  return (
    <div className={`min-h-screen bg-background text-foreground transition-colors duration-300 ${localSettings.theme === 'light' ? 'theme-light' : ''}`}>
      <header className="h-14 border-b border-border bg-card/50 backdrop-blur-sm px-4 flex items-center gap-4 sticky top-0 z-40">
        <Button size="icon" variant="ghost" onClick={() => navigate('/dashboard')}>
          <ArrowLeft className={`w-5 h-5 ${isLocalRTL ? 'rotate-180' : ''}`} />
        </Button>
        <h1 className="text-lg font-bold">{localT('settings')}</h1>
      </header>

      <main className="p-4 max-w-2xl mx-auto space-y-6">
        
        <section className="panel">
          <div className="panel-header">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-primary" />
              <span className="panel-title">{localT('accountSecurity')}</span>
            </div>
          </div>
          <form onSubmit={handleUpdatePassword} className="p-4 space-y-4">
            <div className="space-y-2 text-left rtl:text-right">
              <Label className="data-label">{localT('currentPassword')}</Label>
              <div className="relative">
                <Input
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={passwordData.current}
                  onChange={(e) => setPasswordData({ ...passwordData, current: e.target.value })}
                  className={isLocalRTL ? 'pl-10 pr-3' : 'pr-10 pl-3'}
                  required
                />
                <button 
                  type="button" 
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)} 
                  className={`absolute top-1/2 -translate-y-1/2 text-muted-foreground ${isLocalRTL ? 'left-3' : 'right-3'}`}
                >
                  {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2 text-left rtl:text-right">
              <Label className="data-label">{localT('newPassword')}</Label>
              <div className="relative">
                <Input
                  type={showNewPassword ? 'text' : 'password'}
                  value={passwordData.new}
                  onChange={(e) => setPasswordData({ ...passwordData, new: e.target.value })}
                  className={isLocalRTL ? 'pl-10 pr-3' : 'pr-10 pl-3'}
                  required
                />
                <button 
                  type="button" 
                  onClick={() => setShowNewPassword(!showNewPassword)} 
                  className={`absolute top-1/2 -translate-y-1/2 text-muted-foreground ${isLocalRTL ? 'left-3' : 'right-3'}`}
                >
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2 text-left rtl:text-right">
              <Label className="data-label">{localT('confirmNewPassword')}</Label>
              <Input
                type="password"
                value={passwordData.confirm}
                onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin ml-2" />
              ) : (
                <Lock className={`w-4 h-4 ${isLocalRTL ? 'ml-2' : 'mr-2'}`} />
              )}
              {localT('updatePassword')}
            </Button>
          </form>
        </section>

        {/* أقسام المظهر واللغة */}
        <section className="panel">
          <div className="panel-header flex items-center gap-2">
            <Palette className="w-4 h-4 text-primary" />
            <span className="panel-title">{localT('appearance')}</span>
          </div>
          <div className="p-4">
            <RadioGroup 
              value={localSettings.theme} 
              onValueChange={(val) => setLocalSettings({ ...localSettings, theme: val as 'dark' | 'light' })}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <RadioGroupItem value="dark" id="dark" />
                <Label htmlFor="dark">{localT('darkMode')}</Label>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <RadioGroupItem value="light" id="light" />
                <Label htmlFor="light">{localT('lightMode')}</Label>
              </div>
            </RadioGroup>
          </div>
        </section>

        <section className="panel">
          <div className="panel-header flex items-center gap-2">
            <Globe className="w-4 h-4 text-primary" />
            <span className="panel-title">{localT('language')}</span>
          </div>
          <div className="p-4">
            <RadioGroup 
              value={localSettings.language} 
              onValueChange={(val) => setLocalSettings({ ...localSettings, language: val as Language })}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <RadioGroupItem value="en" id="en" />
                <Label htmlFor="en">English</Label>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <RadioGroupItem value="ar" id="ar" />
                <Label htmlFor="ar">العربية</Label>
              </div>
            </RadioGroup>
          </div>
        </section>

        <div className="flex gap-3 pb-8">
          <Button variant="tactical" onClick={handleRevertDefaults} className="flex-1">
            <RotateCcw className={`w-4 h-4 ${isLocalRTL ? 'ml-2' : 'mr-2'}`} /> {localT('defaults')}
          </Button>
          <Button onClick={handleSaveSettings} className="flex-1 bg-primary text-white hover:bg-primary/90">
            <Save className={`w-4 h-4 ${isLocalRTL ? 'ml-2' : 'mr-2'}`} /> {localT('saveSettings')}
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Settings;