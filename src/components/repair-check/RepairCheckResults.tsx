import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  XCircle,
  Scale,
  Home,
  FileWarning,
  ClipboardCheck,
  Paintbrush,
  Info
} from 'lucide-react';
import type { RepairCheckInputs, RepairCheckResult } from '@/types/repairCheck';

interface RepairCheckResultsProps {
  inputs: RepairCheckInputs;
  results: RepairCheckResult;
}

function StatusBadge({ status }: { status: RepairCheckResult['status'] }) {
  switch (status) {
    case 'keine_pflicht':
      return (
        <Badge className="result-positive text-base px-4 py-1.5">
          <CheckCircle2 className="h-4 w-4 mr-2" />
          Keine Renovierungspflicht!
        </Badge>
      );
    case 'moeglich':
      return (
        <Badge className="result-warning text-base px-4 py-1.5">
          <AlertTriangle className="h-4 w-4 mr-2" />
          Renovierung möglicherweise erforderlich
        </Badge>
      );
    default:
      return (
        <Badge className="result-neutral text-base px-4 py-1.5">
          <HelpCircle className="h-4 w-4 mr-2" />
          Rechtslage prüfen
        </Badge>
      );
  }
}

function StatCard({ 
  icon: Icon, 
  label, 
  value, 
  variant = 'default' 
}: { 
  icon: React.ElementType; 
  label: string; 
  value: string;
  variant?: 'default' | 'success' | 'warning' | 'danger';
}) {
  const variantClasses = {
    default: 'bg-card border',
    success: 'bg-primary/10 border-primary/20',
    warning: 'bg-warning/10 border-warning/20',
    danger: 'bg-destructive/10 border-destructive/20',
  };

  const iconVariantClasses = {
    default: 'text-muted-foreground',
    success: 'text-primary',
    warning: 'text-warning',
    danger: 'text-destructive',
  };

  return (
    <div className={`rounded-lg p-4 ${variantClasses[variant]}`}>
      <div className="flex items-center gap-2 mb-1">
        <Icon className={`h-4 w-4 ${iconVariantClasses[variant]}`} />
        <span className="text-xs text-muted-foreground font-medium">{label}</span>
      </div>
      <p className="text-sm font-semibold">{value}</p>
    </div>
  );
}

export function RepairCheckResults({ inputs, results }: RepairCheckResultsProps) {
  const uebernahmeLabels: Record<string, string> = {
    renoviert: 'Renoviert',
    unrenoviert: 'Unrenoviert',
    teilweise: 'Teilweise',
  };

  const zustandLabels: Record<string, string> = {
    gut: 'Gut',
    normal: 'Normal',
    stark: 'Stark abgenutzt',
  };

  const renovierenLabel = results.status === 'keine_pflicht' 
    ? 'Nein' 
    : results.status === 'moeglich' 
      ? 'Möglich' 
      : 'Unklar';

  const renovierenVariant = results.status === 'keine_pflicht'
    ? 'success'
    : results.status === 'moeglich'
      ? 'warning'
      : 'default';

  return (
    <div className="space-y-4">
      {/* Hauptergebnis */}
      <Card className="card-highlight">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Scale className="h-5 w-5 text-primary" />
            Ergebnis der Prüfung
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <StatusBadge status={results.status} />
            {results.unwirksame_klauseln.length > 0 && (
              <p className="text-sm text-muted-foreground mt-3">
                {results.unwirksame_klauseln.length} unwirksame Klausel{results.unwirksame_klauseln.length > 1 ? 'n' : ''} gefunden
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 4er Grid */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard
          icon={Home}
          label="Übernahme"
          value={uebernahmeLabels[inputs.uebernahme_zustand]}
        />
        <StatCard
          icon={FileWarning}
          label="Unwirksame Klauseln"
          value={String(results.unwirksame_klauseln.length)}
          variant={results.unwirksame_klauseln.length > 0 ? 'success' : 'default'}
        />
        <StatCard
          icon={ClipboardCheck}
          label="Aktueller Zustand"
          value={zustandLabels[inputs.wohnung_zustand_aktuell]}
        />
        <StatCard
          icon={Paintbrush}
          label="Renovieren?"
          value={renovierenLabel}
          variant={renovierenVariant}
        />
      </div>

      {/* Unwirksame Klauseln Liste */}
      {results.unwirksame_klauseln.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <XCircle className="h-5 w-5 text-destructive" />
              Unwirksame Klauseln
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {results.unwirksame_klauseln.map((klausel, index) => (
              <div key={index} className="border-l-2 border-destructive pl-4 py-2">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-semibold text-sm">{klausel.klausel}</p>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button className="shrink-0">
                        <Info className="h-4 w-4 text-muted-foreground hover:text-primary transition-colors" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="left" className="max-w-sm">
                      <p className="font-medium mb-1">BGH-Urteil:</p>
                      <p className="text-xs">{klausel.bgh}</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{klausel.grund}</p>
                <p className="text-xs text-primary mt-2 font-mono">{klausel.bgh}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Empfehlung */}
      <Alert variant={results.status === 'keine_pflicht' ? 'default' : 'destructive'} className={results.status === 'keine_pflicht' ? 'border-primary/30 bg-primary/5' : ''}>
        <CheckCircle2 className={`h-4 w-4 ${results.status === 'keine_pflicht' ? 'text-primary' : ''}`} />
        <AlertTitle>Empfehlung</AlertTitle>
        <AlertDescription className="text-sm">
          {results.empfehlung}
        </AlertDescription>
      </Alert>

      {/* Hinweis */}
      <div className="text-xs text-muted-foreground text-center p-4 bg-muted/50 rounded-lg">
        <p>
          ⚖️ Diese Prüfung ersetzt keine Rechtsberatung. Bei Streit empfehlen wir den Kontakt zum Mieterverein oder Fachanwalt für Mietrecht.
        </p>
      </div>
    </div>
  );
}
