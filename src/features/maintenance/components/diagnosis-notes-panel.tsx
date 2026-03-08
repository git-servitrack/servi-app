import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function DiagnosisNotesPanel({ notes }: { notes: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Diagnosis notes</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-7 text-muted-foreground">{notes}</p>
      </CardContent>
    </Card>
  );
}
