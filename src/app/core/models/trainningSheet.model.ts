export enum trainningType {
  STRENGHT = 'STRENGHT',
  FUNCTIONAL = 'FUNCTIONAL',
  ENDURANCE = 'ENDURANCE',
  HIIT = 'HIIT',
  POWER = 'POWER',
  ASSESSMENT = 'ASSESSMENT',
  REHABILITATION = 'REHABILITATION',
}

// src/app/core/models/trainningSheet.model.ts
// src/app/core/models/trainningSheet.model.ts
export enum FriendlyTrainingType {
  STRENGHT = 'Fuerza',
  FUNCTIONAL = 'Funcional',
  ENDURANCE = 'Resistencia',
  HIIT = 'HIIT',
  POWER = 'Potencia', // Cambiar a un nombre único
  ASSESSMENT = 'Valoración',
  REHABILITATION = 'Rehabilitación',
}

export const TrainingTypeRecordMap: { [key in FriendlyTrainingType]: string } =
  {
    [FriendlyTrainingType.STRENGHT]: 'STRENGHT',
    [FriendlyTrainingType.FUNCTIONAL]: 'FUNCTIONAL',
    [FriendlyTrainingType.ENDURANCE]: 'ENDURANCE',
    [FriendlyTrainingType.HIIT]: 'HIIT',
    [FriendlyTrainingType.POWER]: 'POWER',
    [FriendlyTrainingType.ASSESSMENT]: 'ASSESSMENT',
    [FriendlyTrainingType.REHABILITATION]: 'REHABILITATION',
  };
