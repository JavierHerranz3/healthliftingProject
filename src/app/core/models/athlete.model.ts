export interface Athlete {
  id: string;
  age: number;
  height: string;
  personalInformation: PersonalInformation;
  idAppointments: string[];
  idTrainingSheet: string[];
}

export interface PersonalInformation {
  name: string;
  surname: string;
  documentType: DocumentType;
  document: string;
}

export enum DocumentType {
  DNI = 'DNI',
  PASSPORT = 'PASSPORT',
}
