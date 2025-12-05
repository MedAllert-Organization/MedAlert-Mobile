export type Medication = {
  medicationId: string;
  userId?: string | null;
  name: string;
  description?: string;
  soundTypeId?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type TimezoneEntity = {
  id: string;
  name: string;
  label: string;
  utcOffset: number;
};

export type TreatmentMedication = {
  id: string;
  treatmentId?: string | null;
  medicationId?: string | null;
  dose?: string | null;
  takenQuantity?: number | null;
  totalQuantity?: number | null;
  treatment?: Treatment | null;
  medication?: Medication | null;
  visualTypeId?: string | null;
  visualType?: VisualType | null;
  lastTaken?: string | null;
  nextTakeAt?: string | null;
  timezone?: TimezoneEntity | null;
  alertPeriodInMinutes?: number | null;
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
