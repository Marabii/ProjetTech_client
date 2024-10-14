export interface Stage {
  nom_d_entreprise: string;
  annee_du_stage: Date;
  duree_du_stage: string;
  poste: string;
}

export interface Diplome {
  nom: string;
  annee_d_obtention: Date;
}

export interface Electif {
  type_electif: string;
  etablissement_electif: string;
  semestre_d_electif: string;
}

export interface AutreParcoursDiplomant {
  type: string;
  aPartenariat: boolean;
  etablissement: string;
  duree: string;
  pays: string;
}

export interface Parcours {
  type_de_bac: string;
  filiere_d_origine: string;
  prepa_d_origine: string;
  mode_d_admission: "AST" | "Mines-Pont" | "EM" | "FAC";
  est_fusion: boolean;
  autre_parcours_diplomant: AutreParcoursDiplomant;
  stages: Stage[];
  diplomes: Diplome[];
  electifs: Electif[];
}

export interface Etudiant {
  Date_de_naissance: Date;
  annee_d_entree: Date;
  nom: string;
  prenom: string;
  mail: string;
  Genre: boolean;
  Parcours: Parcours;
}
