import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  FileText, 
  Eye 
} from 'lucide-react';
import { mockAlerts, mockIncidents } from '@/data/mockData';
import { formatDistanceToNow } from 'date-fns';
import { ar, enUS } from 'date-fns/locale';
import { useLanguage } from '@/contexts/LanguageContext';

const Incidents = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const isRTL = language === 'ar';

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Header */}
      <header className="h-14 border-b border-border bg-card/50 backdrop-blur-sm px-4 flex items-center gap-4 sticky top-0 z-40">
        <Button size="icon" variant="ghost" onClick={() => navigate('/dashboard')}>
          <ArrowLeft className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
        </Button>
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          <h1 className="text-lg font-bold">{t('viewAllIncidents')}</h1>
        </div>
      </header>

      <main className="p-4 max-w-7xl mx-auto">
        {/* Incidents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {[...mockIncidents, ...mockAlerts.filter(a => a.status !== 'dismissed')].map((item) => (
            <div 
              key={item.id}
              className="panel cursor-pointer hover:border-primary/40 transition-all group overflow-hidden border border-border bg-card shadow-sm"
              onClick={() => navigate(`/incidents/${item.id}`)}
            >
              {/* Thumbnail Area - تم حذف الـ Badge الخاص بالخطورة من هنا */}
              <div className="aspect-video relative overflow-hidden bg-muted">
                <img 
                  src={(item as any).media?.[0] || (item as any).thumbnail} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  alt="Incident"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
              </div>

              <div className="p-4 space-y-4">
                {/* Status & ID */}
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className={
                    item.status === 'active' ? 'border-destructive text-destructive bg-destructive/5' :
                    item.status === 'resolved' ? 'border-success text-success bg-success/5' :
                    'border-warning text-warning bg-warning/5'
                  }>
                    {item.status === 'active' ? t('active') : item.status === 'resolved' ? t('resolved') : t('pending')}
                  </Badge>
                  <span className="font-mono text-[11px] font-bold opacity-50 tracking-tighter">{item.id}</span>
                </div>

                {/* Location & Time */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4 text-primary/70" />
                    <span className="truncate">{(item as any).location.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4 text-primary/70" />
                    <span>{formatDistanceToNow(new Date((item as any).startTime || (item as any).timestamp), { 
                      addSuffix: true,
                      locale: isRTL ? ar : enUS 
                    })}</span>
                  </div>
                </div>

                {/* Progress Bar Area (Confidence) */}
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">
                      {t('detectionConfidence')}
                    </span>
                    <span className="font-mono text-xs font-bold text-primary">
                      {Math.round((item as any).confidence > 1 ? (item as any).confidence : (item as any).confidence * 100)}%
                    </span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden border border-border/20">
                    <div 
                      className="h-full bg-primary shadow-[0_0_8px_rgba(var(--primary),0.4)] transition-all duration-1000"
                      style={{ width: `${(item as any).confidence > 1 ? (item as any).confidence : (item as any).confidence * 100}%` }}
                    />
                  </div>
                </div>

                {/* View Button */}
                <Button variant="tactical" className="w-full h-10 mt-2 font-bold group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <Eye className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                  {t('viewFullDetails')}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Incidents;