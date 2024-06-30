export interface Coach{
    id: string;
    personalInformation: PersonalInformation;
    idAppointments: string[];
    idTrainingSheet: string[];
    eliminate: boolean;
}

export interface PersonalInformation {
    name: string;
    surname: string;
    documentType: DocumentType;
    document: string;
}