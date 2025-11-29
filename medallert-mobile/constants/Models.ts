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
  visualType: VisualType | null;
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
  medications?: TreatmentMedication[] | null;
};

export type Annotation = {
  annotationId: string;
  medicationId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};

export enum VisualTypeEnum {
  CAPSULE = "CAPSULE",
  PILL = "PILL",
  TABLET = "TABLET",
  DROP = "DROP",
  LIQUID = "LIQUID",
  INHALER = "INHALER",
  INJECTION = "INJECTION",
  OINTMENT = "OINTMENT",
  PATCH = "PATCH",
}

export enum VisualSizeEnum {
  SMALL = "SMALL",
  MEDIUM = "MEDIUM",
  LARGE = "LARGE",
}

export enum VisualPatternEnum {
  SOLID = "SOLID",
  STRIPED = "STRIPED",
  HALF = "HALF",
  RING = "RING",
  DOTS = "DOTS",
  BAND = "BAND",
  GRADIENT = "GRADIENT",
}

export interface VisualType {
  visualId: string;
  visualType: VisualTypeEnum;
  size: VisualSizeEnum;
  color1: string;
  color2: string | null;
  pattern: VisualPatternEnum;
}
