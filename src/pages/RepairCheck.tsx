import { useState } from 'react';
import { RepairCheckForm } from '@/components/repair-check/RepairCheckForm';
import { RepairCheckResults } from '@/components/repair-check/RepairCheckResults';
import { useRepairCheck } from '@/hooks/useRepairCheck';
import { getDefaultInputs } from '@/types/repairCheck';
import type { RepairCheckInputs } from '@/types/repairCheck';
import { Button } from '@/components/ui/button';
import { RotateCcw, Scale, Shield } from 'lucide-react';

export default function RepairCheck() {
  const [inputs, setInputs] = useState<RepairCheckInputs>(getDefaultInputs());
  const results = useRepairCheck(inputs);

  const handleReset = () => {
    setInputs(getDefaultInputs());
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="gradient-primary text-primary-foreground py-8 px-4">
        <div className="container max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-white/10 rounded-lg">
              <Scale className="h-6 w-6" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold">Schönheitsreparaturen-Check</h1>
          </div>
          <p className="text-primary-foreground/80 max-w-2xl">
            Prüfen Sie kostenlos, ob die Schönheitsreparatur-Klauseln in Ihrem Mietvertrag nach der BGH-Rechtsprechung wirksam sind.
          </p>
        </div>
      </header>

      {/* Trust Indicators */}
      <div className="border-b bg-card">
        <div className="container max-w-6xl mx-auto py-3 px-4">
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              <span>Basierend auf BGH-Rechtsprechung</span>
            </div>
            <div className="flex items-center gap-2">
              <Scale className="h-4 w-4 text-primary" />
              <span>Kostenlose Ersteinschätzung</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container max-w-6xl mx-auto py-8 px-4">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Form */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="section-title">Ihre Angaben</h2>
              <Button variant="ghost" size="sm" onClick={handleReset} className="text-xs">
                <RotateCcw className="h-3 w-3 mr-1" />
                Zurücksetzen
              </Button>
            </div>
            <RepairCheckForm inputs={inputs} onChange={setInputs} />
          </div>

          {/* Right Column - Results */}
          <div className="lg:sticky lg:top-8 lg:self-start space-y-4">
            <h2 className="section-title">Ergebnis</h2>
            <RepairCheckResults inputs={inputs} results={results} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-6 mt-8">
        <div className="container max-w-6xl mx-auto px-4 text-center text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Schönheitsreparaturen-Check | Keine Rechtsberatung</p>
        </div>
      </footer>
    </div>
  );
}
