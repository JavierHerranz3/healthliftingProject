export interface Coach {
  id: string;
  personalInformation: {
    name: string;
    surname: string;
    documentType: string;
    document: string;
  };
  idAppointments: string[];
  idTrainingSheet: string[];
}
export enum DocumentType {
  DNI = 'DNI',
  PASSPORT = 'PASSPORT',
}
