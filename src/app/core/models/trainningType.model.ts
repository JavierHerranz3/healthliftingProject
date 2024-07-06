export enum trainningType {
  STRENGHT = 'STRENGHT',
  FUNCTIONAL = 'FUNCTIONAL',
  ENDURANCE = 'ENDURANCE',
  HIIT = 'HIIT',
  POWER = 'POWER',
  ASSESSMENT = 'ASSESSMENT',
  REHABILITATION = 'REHABILITATION',
}

export enum FriendlyTrainingType {
  STRENGHT = 'Fuerza',
  FUNCTIONAL = 'Funcional',
  ENDURANCE = 'Resistencia',
  HIIT = 'HIIT',
  POWER = 'Potencia',
  ASSESSMENT = 'Valoración',
  REHABILITATION = 'Rehabilitación',
}

export const TrainingTypeRecordMap: {
  [key in FriendlyTrainingType]: trainningType;
} = {
  [FriendlyTrainingType.STRENGHT]: trainningType.STRENGHT,
  [FriendlyTrainingType.FUNCTIONAL]: trainningType.FUNCTIONAL,
  [FriendlyTrainingType.ENDURANCE]: trainningType.ENDURANCE,
  [FriendlyTrainingType.HIIT]: trainningType.HIIT,
  [FriendlyTrainingType.POWER]: trainningType.POWER,
  [FriendlyTrainingType.ASSESSMENT]: trainningType.ASSESSMENT,
  [FriendlyTrainingType.REHABILITATION]: trainningType.REHABILITATION,
};
