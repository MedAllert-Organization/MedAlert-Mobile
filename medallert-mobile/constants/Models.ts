export type Medication = {
  medicationId: string;
  treatmentId?: string | null;
  userId?: string | null;
  name: string;
  dose?: string | null;
  description?: string;
  visualTypeId?: string;
  soundTypeId?: string;
  alertPeriodInMinutes?: number | null;
  endTreatmentAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
  takenQuantity?: number | null;
  totalQuantity?: number | null;
  lastTaken?: string | null;
  nextTakeAt?: string | null;
  timezone?: string;
};

export type TreatmentMedication = {
  medicationId: string;
  name: string;
  dose: string;
  takenQuantity: number;
  totalQuantity: number;
};

export type Treatment = {
  treatmentId: string;
  userId?: string | null;
  name?: string | null;
  description?: string | null;
  startAt?: string | null;
  endAt?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  medications?: Medication[] | null;
};

export type Annotation = {
    annotationId: string;
    medicationId: string;
    content: string;
    createdAt: string;
    updatedAt: string;
};