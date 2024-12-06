export interface Etudiant {
  "Identifiant OP": string;
  "Etablissement d'origine"?: string;
  Filière?: string;
  Nationalité?: string;
  Nom?: string;
  Prénom?: string;
  "CONVENTION DE STAGE"?: ConventionDeStage[];
  "UNIVERSITE visitant"?: UniversiteVisitant[];
  DéfiEtMajeure?: DéfiEtMajeure;
}

export interface ConventionDeStage {
  "Entité principale - Identifiant OP": string;
  "Date de début du stage": string;
  "Date de fin du stage": string;
  "Stage Fonction occupée": string;
  "Nom Stage": string;
}

export interface UniversiteVisitant {
  "Entité principale - Identifiant OP": string;
  "Date de début mobilité": string;
  "Date de fin mobilité": string;
  "Type Mobilité": string;
  "Nom mobilité": string;
}

export interface Majeure {
  nom: string;
  promo: string;
}

export interface DéfiEtMajeure {
  défi: string;
  majeures: Majeure[];
}
