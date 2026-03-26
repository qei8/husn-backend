import { Button } from '@/components/ui/button';
import { 
  AlertTriangle, 
  MapPin, 
  Clock, 
  Eye, 
  CheckCircle2, 
  XCircle,
  ExternalLink,
  Volume2
} from 'lucide-react';
import { Alert } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { useLanguage } from '@/contexts/LanguageContext';

interface CenteredAlertProps {
  alert: Alert;
  onViewDetails: () => void;
  onConfirm: () => void;
  onDismiss: () => void;
}

const CenteredAlert = ({ alert, onViewDetails, onConfirm, onDismiss }: CenteredAlertProps) => {
  const { t } = useLanguage();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
      
      {/* Alert Modal */}
      <div className="relative w-full max-w-lg mx-4 animate-slide-in-alert">
        <div className="gradient-alert rounded-xl border-2 border-destructive overflow-hidden glow-alert">
          {/* Header */}
          <div className="bg-destructive/20 border-b border-destructive/30 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-destructive/20 border-2 border-destructive flex items-center justify-center animate-pulse">
                  <AlertTriangle className="w-6 h-6 text-destructive" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-destructive">{t('fireDetected')}</h2>
                  <p className="text-sm text-destructive/80">{t('highPriorityAlert')}</p>
                </div>
              </div>
              <Volume2 className="w-6 h-6 text-destructive animate-pulse" />
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            {/* Alert ID & Time */}
            <div className="flex items-center justify-between">
              <span className="font-mono text-lg text-foreground">{alert.id}</span>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>{formatDistanceToNow(new Date(alert.timestamp), { addSuffix: true })}</span>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg border border-border">
              <MapPin className="w-5 h-5 text-primary mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-foreground">{alert.location.name}</p>
                <p className="text-xs text-muted-foreground font-mono">
                  {alert.location.lat.toFixed(4)}, {alert.location.lon.toFixed(4)}
                </p>
              </div>
              <Button size="sm" variant="ghost" className="h-7">
                <ExternalLink className="w-3 h-3 mr-1" />
                {t('map')}
              </Button>
            </div>

            {/* Confidence */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{t('detectionConfidence')}</span>
                <span className="font-bold text-destructive">{alert.confidence}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-destructive to-alert-high transition-all"
                  style={{ width: `${alert.confidence}%` }}
                />
              </div>
            </div>

            {/* Thumbnail */}
            {alert.thumbnail && (
              <div className="relative aspect-video rounded-lg overflow-hidden border border-border">
                <img 
                  src={alert.thumbnail} 
                  alt="Alert thumbnail" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
                <div className="absolute bottom-2 left-2 text-xs text-foreground/80">
                  {t('capturedFrame')}
                </div>
              </div>
            )}

            {/* Description */}
            {alert.description && (
              <p className="text-sm text-muted-foreground">{alert.description}</p>
            )}
          </div>

          {/* Actions */}
          <div className="px-6 pb-6 flex gap-3">
            <Button 
              variant="default" 
              className="flex-1"
              onClick={onViewDetails}
            >
              <Eye className="w-4 h-4 mr-2" />
              {t('viewFullDetails')}
            </Button>
            <Button 
              variant="success" 
              className="flex-1"
              onClick={onConfirm}
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              {t('confirmAlert')}
            </Button>
            <Button 
              variant="ghost" 
              className="text-muted-foreground"
              onClick={onDismiss}
            >
              <XCircle className="w-4 h-4" />
            </Button>
          </div>

          {/* Footer */}
          <div className="px-6 pb-4">
            <button className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              {t('reportFalsePositive')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CenteredAlert;
