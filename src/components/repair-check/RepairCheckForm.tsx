import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { HelpCircle, Home, FileText, ClipboardCheck } from 'lucide-react';
import type { RepairCheckInputs, UebernahmeZustand, WohnungZustand } from '@/types/repairCheck';

interface RepairCheckFormProps {
  inputs: RepairCheckInputs;
  onChange: (inputs: RepairCheckInputs) => void;
}

interface CheckboxFieldProps {
  id: string;
  label: string;
  hint?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

function CheckboxField({ id, label, hint, checked, onCheckedChange }: CheckboxFieldProps) {
  return (
    <div className="flex items-start gap-3 py-2">
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={onCheckedChange}
        className="mt-0.5"
      />
      <div className="flex-1 min-w-0">
        <Label htmlFor={id} className="text-sm font-medium cursor-pointer">
          {label}
        </Label>
        {hint && (
          <p className="text-xs text-muted-foreground mt-0.5">{hint}</p>
        )}
      </div>
      {hint && (
        <Tooltip>
          <TooltipTrigger asChild>
            <HelpCircle className="h-4 w-4 text-muted-foreground shrink-0" />
          </TooltipTrigger>
          <TooltipContent side="left" className="max-w-xs">
            <p>{hint}</p>
          </TooltipContent>
        </Tooltip>
      )}
    </div>
  );
}

export function RepairCheckForm({ inputs, onChange }: RepairCheckFormProps) {
  const updateField = <K extends keyof RepairCheckInputs>(
    field: K,
    value: RepairCheckInputs[K]
  ) => {
    onChange({ ...inputs, [field]: value });
  };

  return (
    <div className="space-y-4">
      {/* Gruppe 1: Übernahme der Wohnung */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Home className="h-5 w-5 text-primary" />
            Übernahme der Wohnung
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="uebernahme_zustand">Zustand bei Einzug</Label>
            <Select
              value={inputs.uebernahme_zustand}
              onValueChange={(v) => updateField('uebernahme_zustand', v as UebernahmeZustand)}
            >
              <SelectTrigger id="uebernahme_zustand">
                <SelectValue placeholder="Bitte wählen" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="renoviert">Renoviert übernommen</SelectItem>
                <SelectItem value="unrenoviert">Unrenoviert übernommen</SelectItem>
                <SelectItem value="teilweise">Teilweise renoviert</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="einzugsdatum">Einzugsdatum</Label>
            <Input
              id="einzugsdatum"
              type="date"
              value={inputs.einzugsdatum}
              onChange={(e) => updateField('einzugsdatum', e.target.value)}
            />
          </div>

          <CheckboxField
            id="renovierung_bei_einzug"
            label="Selbst renoviert bei Einzug?"
            hint="Haben Sie die Wohnung bei Einzug selbst renoviert?"
            checked={inputs.renovierung_bei_einzug}
            onCheckedChange={(v) => updateField('renovierung_bei_einzug', v)}
          />
        </CardContent>
      </Card>

      {/* Gruppe 2: Klauseln im Mietvertrag */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <FileText className="h-5 w-5 text-primary" />
            Klauseln im Mietvertrag
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 divide-y divide-border">
          <CheckboxField
            id="hat_fristenplan"
            label="Fristenplan vorhanden?"
            hint='Z.B. "Küche alle 3 Jahre, Bad alle 5 Jahre..."'
            checked={inputs.hat_fristenplan}
            onCheckedChange={(v) => updateField('hat_fristenplan', v)}
          />
          <CheckboxField
            id="fristen_starr"
            label="Starre Fristen?"
            hint='"Spätestens nach X Jahren" - ohne Wenn und Aber'
            checked={inputs.fristen_starr}
            onCheckedChange={(v) => updateField('fristen_starr', v)}
          />
          <CheckboxField
            id="fristen_weich"
            label="Weiche Fristen?"
            hint='"In der Regel nach X Jahren" - flexibel formuliert'
            checked={inputs.fristen_weich}
            onCheckedChange={(v) => updateField('fristen_weich', v)}
          />
          <CheckboxField
            id="farbvorgabe"
            label="Farbvorgabe bei Auszug?"
            hint='"In neutralen/weißen/hellen Farben zurückgeben"'
            checked={inputs.farbvorgabe}
            onCheckedChange={(v) => updateField('farbvorgabe', v)}
          />
          <CheckboxField
            id="quotenklausel"
            label="Quotenklausel?"
            hint="Anteilige Kosten bei Auszug vor Ablauf der Fristen"
            checked={inputs.quotenklausel}
            onCheckedChange={(v) => updateField('quotenklausel', v)}
          />
          <CheckboxField
            id="endrenovierung"
            label="Endrenovierungsklausel?"
            hint='"Die Wohnung ist bei Auszug zu renovieren"'
            checked={inputs.endrenovierung}
            onCheckedChange={(v) => updateField('endrenovierung', v)}
          />
        </CardContent>
      </Card>

      {/* Gruppe 3: Aktueller Zustand */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <ClipboardCheck className="h-5 w-5 text-primary" />
            Aktueller Zustand
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="wohnung_zustand_aktuell">Aktueller Zustand der Wohnung</Label>
            <Select
              value={inputs.wohnung_zustand_aktuell}
              onValueChange={(v) => updateField('wohnung_zustand_aktuell', v as WohnungZustand)}
            >
              <SelectTrigger id="wohnung_zustand_aktuell">
                <SelectValue placeholder="Bitte wählen" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gut">Gut (wenig Spuren)</SelectItem>
                <SelectItem value="normal">Normal (übliche Abnutzung)</SelectItem>
                <SelectItem value="stark">Stark abgenutzt</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
