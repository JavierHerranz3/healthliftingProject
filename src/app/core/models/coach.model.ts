export interface Coach {
  id: string;
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
  ID = 'ID',
  PASSPORT = 'PASSPORT',
}
