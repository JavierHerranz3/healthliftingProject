export interface Appointment {
  id: string;
  date: Date | null;
  time: string;
  athleteId: string;
  athleteName: string;
  athleteSurname: string;
  coachId: string;
  coachName: string;
  coachSurname: string;
  trainingType: string;
}
