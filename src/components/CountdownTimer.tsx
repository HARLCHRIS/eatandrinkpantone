import { useCountdown } from '../hooks/useCountdown';
import { Clock } from 'lucide-react';

interface CountdownTimerProps {
  targetDate: string;
  label?: string;
  compact?: boolean;
}

/**
 * Composant de compte à rebours dynamique.
 * Affiche les jours, heures, minutes et secondes restantes avec animation.
 *
 * @param {CountdownTimerProps} props - Date cible au format ISO string et options d'affichage.
 * @returns {React.ReactElement} Widget chronomètre responsive.
 */
export const CountdownTimer = ({
  targetDate,
  label = 'Clôture des candidatures dans :',
  compact = false,
}: CountdownTimerProps) => {
  const { days, hours, minutes, seconds, isExpired } = useCountdown(targetDate);

  if (isExpired) {
    return (
      <div className="flex items-center gap-2 text-red-600 font-semibold text-sm bg-red-50 px-3 py-1.5 rounded-full border border-red-200">
        <Clock size={16} />
        <span>Inscriptions closes</span>
      </div>
    );
  }

  if (compact) {
    return (
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: 600, color: '#f59e0b', background: 'rgba(245, 158, 11, 0.1)', padding: '6px 14px', borderRadius: '20px', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
        <Clock size={14} />
        <span>{days}j {hours}h {minutes}m {seconds}s</span>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center', margin: '12px 0' }}>
      {label && <p style={{ fontSize: '0.85rem', fontWeight: 500, color: 'rgba(255,255,255,0.9)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</p>}
      <div style={{ display: 'flex', gap: '12px' }}>
        {[
          { value: days, label: 'Jours' },
          { value: hours, label: 'Heures' },
          { value: minutes, label: 'Min' },
          { value: seconds, label: 'Sec' },
        ].map((item, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(0, 0, 0, 0.25)',
              backdropFilter: 'blur(8px)',
              padding: '10px 16px',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              minWidth: '65px',
            }}
          >
            <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.6rem', fontWeight: 700, color: '#ffffff', lineHeight: 1 }}>
              {String(item.value).padStart(2, '0')}
            </span>
            <span style={{ fontSize: '0.7rem', color: '#cbd5e1', textTransform: 'uppercase', marginTop: '4px' }}>
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
