import { useMemo } from 'react';
import type { RepairCheckInputs, RepairCheckResult, UnwirksameKlausel } from '@/types/repairCheck';
import { BGH_URTEILE } from '@/types/repairCheck';

export function useRepairCheck(inputs: RepairCheckInputs): RepairCheckResult {
  return useMemo(() => {
    const unwirksame_klauseln: UnwirksameKlausel[] = [];

    // Unrenoviert übernommen ohne eigene Renovierung
    if (inputs.uebernahme_zustand === 'unrenoviert' && !inputs.renovierung_bei_einzug) {
      unwirksame_klauseln.push({
        klausel: 'Gesamte Schönheitsreparaturklausel',
        grund: 'Wohnung unrenoviert übernommen - Mieter muss nicht besser zurückgeben als erhalten',
        bgh: BGH_URTEILE.unrenoviert,
      });
    }

    // Teilweise renoviert ohne eigene Renovierung kann auch problematisch sein
    if (inputs.uebernahme_zustand === 'teilweise' && !inputs.renovierung_bei_einzug) {
      unwirksame_klauseln.push({
        klausel: 'Schönheitsreparaturklausel (teilweise)',
        grund: 'Wohnung nur teilweise renoviert übernommen - Renovierungspflicht kann eingeschränkt sein',
        bgh: BGH_URTEILE.unrenoviert,
      });
    }

    // Starre Fristen
    if (inputs.fristen_starr) {
      unwirksame_klauseln.push({
        klausel: 'Starre Fristenklausel',
        grund: '"Spätestens nach X Jahren" schließt individuelle Bedarfsprüfung aus',
        bgh: BGH_URTEILE.starre_fristen,
      });
    }

    // Quotenklausel
    if (inputs.quotenklausel) {
      unwirksame_klauseln.push({
        klausel: 'Quotenklausel',
        grund: 'Anteilige Kostenbeteiligung bei Auszug ist immer unwirksam',
        bgh: BGH_URTEILE.quotenklausel,
      });
    }

    // Endrenovierungsklausel
    if (inputs.endrenovierung) {
      unwirksame_klauseln.push({
        klausel: 'Endrenovierungsklausel',
        grund: 'Pflicht zur Renovierung "bei Auszug" ohne Bedarfsprüfung ist unwirksam',
        bgh: BGH_URTEILE.endrenovierung,
      });
    }

    // Farbvorgabe kann problematisch sein
    if (inputs.farbvorgabe && inputs.endrenovierung) {
      unwirksame_klauseln.push({
        klausel: 'Farbvorgabe bei Auszug',
        grund: 'Strikte Farbvorgabe in Kombination mit Endrenovierung ist unwirksam',
        bgh: BGH_URTEILE.farbvorgabe,
      });
    }

    // Bestimme Status
    const muss_renovieren = unwirksame_klauseln.length === 0 && inputs.wohnung_zustand_aktuell === 'stark';
    
    let status: RepairCheckResult['status'];
    let empfehlung: string;

    if (unwirksame_klauseln.length > 0) {
      status = 'keine_pflicht';
      empfehlung = `Sie haben ${unwirksame_klauseln.length} unwirksame Klausel${unwirksame_klauseln.length > 1 ? 'n' : ''} in Ihrem Mietvertrag. Nach der BGH-Rechtsprechung sind Sie wahrscheinlich nicht zur Durchführung von Schönheitsreparaturen verpflichtet. Dokumentieren Sie den Zustand bei Auszug und weisen Sie Ihren Vermieter auf die unwirksamen Klauseln hin.`;
    } else if (muss_renovieren) {
      status = 'moeglich';
      empfehlung = 'Die Klauseln in Ihrem Mietvertrag scheinen wirksam zu sein und der Zustand der Wohnung deutet auf Renovierungsbedarf hin. Prüfen Sie, ob die Abnutzung über das vertragsgemäße Maß hinausgeht. Im Zweifelsfall kontaktieren Sie einen Mieterverein.';
    } else {
      status = 'unklar';
      empfehlung = 'Die Rechtslage ist nicht eindeutig. Die Klauseln könnten wirksam sein, aber der Renovierungsbedarf scheint gering. Dokumentieren Sie den Zustand und holen Sie im Streitfall fachkundigen Rat ein.';
    }

    return {
      unwirksame_klauseln,
      muss_renovieren,
      status,
      empfehlung,
    };
  }, [inputs]);
}
