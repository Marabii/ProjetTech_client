// Mapping of safe keys to actual field names
export const fieldMappings: { [key: string]: string } = {
  identifiantOP: "Identifiant OP",
  etablissementOrigine: "Etablissement d'origine",
  filiere: "Filière",
  nationalite: "Nationalité",
  nom: "Nom",
  prenom: "Prénom",
  // Convention de Stage fields
  conventionEntiteIdentifiantOP:
    "CONVENTION DE STAGE.Entité principale - Identifiant OP",
  conventionDateDebutStage: "CONVENTION DE STAGE.Date de début du stage",
  conventionDateFinStage: "CONVENTION DE STAGE.Date de fin du stage",
  conventionFonctionOccupee: "CONVENTION DE STAGE.Stage Fonction occupée",
  conventionNomStage: "CONVENTION DE STAGE.Nom Stage",
  // Universite Visitant fields
  universiteEntiteIdentifiantOP:
    "UNIVERSITE visitant.Entité principale - Identifiant OP",
  universiteDateDebutMobilite: "UNIVERSITE visitant.Date de début mobilité",
  universiteDateFinMobilite: "UNIVERSITE visitant.Date de fin mobilité",
  universiteTypeMobilite: "UNIVERSITE visitant.Type Mobilité",
  universiteNomMobilite: "UNIVERSITE visitant.Nom mobilité",
};
