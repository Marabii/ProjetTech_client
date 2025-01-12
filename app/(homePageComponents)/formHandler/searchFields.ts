// searchFields.ts

import { SearchFields } from "@/interfaces/form";

export const searchFields: SearchFields = {
  commonSearch: [
    {
      name: "ANNÉE DE DIPLOMATION",
      type: "text",
      label: "Année de diplomation de l'étudiant",
    },
    { name: "Nom", type: "text", label: "Nom de l'étudiant" },
    { name: "Prénom", type: "text", label: "Prénom de l'étudiant" },
    {
      name: "Filière",
      type: "text",
      label: "Filière ou programme suivi par l'étudiant",
    },
    { name: "Nationalité", type: "text", label: "Nationalité de l'étudiant" },
    {
      name: "Etablissement d'origine",
      type: "text",
      label: "Établissement où l'étudiant était inscrit auparavant",
    },
  ],
  advancedSearch: [
    {
      name: "Identifiant OP",
      type: "text",
      label: "Identifiant unique de l'étudiant",
    },
    {
      name: "CONVENTION DE STAGE.Entité liée - Identifiant OP",
      type: "text",
      label: "Identifiant OP de l'entité liée au stage",
    },
    {
      name: "CONVENTION DE STAGE.Date de début du stage",
      type: "date",
      label: "Date de début du stage",
    },
    {
      name: "CONVENTION DE STAGE.Date de fin du stage",
      type: "date",
      label: "Date de fin du stage",
    },
    {
      name: "CONVENTION DE STAGE.Stage Fonction occupée",
      type: "text",
      label: "Fonction occupée par l'étudiant pendant le stage",
    },
    {
      name: "CONVENTION DE STAGE.Nom Stage",
      type: "text",
      label: "Nom du stage",
    },
    {
      name: "CONVENTION DE STAGE.Indemnités du stage",
      type: "text",
      label: "Montant des indemnités perçues pendant le stage",
    },
    {
      name: "CONVENTION DE STAGE.Durée",
      type: "text",
      label: "Durée totale du stage (en mois ou semaines)",
    },
    {
      name: "CONVENTION DE STAGE.Code SIRET",
      type: "text",
      label: "Code SIRET de l'entreprise accueillant le stage",
    },
    {
      name: "CONVENTION DE STAGE.Pays",
      type: "text",
      label: "Pays où se déroule le stage",
    },
    {
      name: "CONVENTION DE STAGE.Ville",
      type: "text",
      label: "Ville où se déroule le stage",
    },
    {
      name: "CONVENTION DE STAGE.Ville (Hors France)",
      type: "text",
      label: "Ville hors France où se déroule le stage",
    },
    {
      name: "CONVENTION DE STAGE.ENTREPRISE DE STAGE",
      type: "text",
      label: "Entreprise de stage",
    },
    {
      name: "UNIVERSITE visitant.Date de début mobilité",
      type: "date",
      label: "Date de début de la mobilité internationale",
    },
    {
      name: "UNIVERSITE visitant.Date de fin mobilité",
      type: "date",
      label: "Date de fin de la mobilité internationale",
    },
    {
      name: "UNIVERSITE visitant.Type Mobilité",
      type: "text",
      label: "Type de mobilité (Erasmus, stage, etc.)",
    },
    {
      name: "UNIVERSITE visitant.Nom mobilité",
      type: "text",
      label: "Nom ou description de la mobilité internationale",
    },
    {
      name: "DéfiEtMajeure.défi",
      type: "text",
      label: "Défi",
    },
    {
      name: "DéfiEtMajeure.majeures.nom/2A",
      type: "text",
      label: "Majeure Pour éléves 2A",
      context: [{ "DéfiEtMajeure.majeures.promo": "2A" }],
    },
    {
      name: "DéfiEtMajeure.majeures.nom/3A",
      type: "text",
      label: "Majeure Pour éléves 3A",
      context: [{ "DéfiEtMajeure.majeures.promo": "3A" }],
    },
  ],
};
