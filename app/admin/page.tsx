"use client";
import { useState } from "react";

export default function NewEtudiant() {
  const [etudiant, setEtudiant] = useState({
    Date_de_naissance: "",
    annee_d_entree: "",
    nom: "",
    prenom: "",
    mail: "",
    Genre: "",
    Parcours: {
      type_de_bac: "",
      filiere_d_origine: "",
      prepa_d_origine: "",
      mode_d_admission: "",
      est_fusion: false,
      autre_parcours_diplomant: {
        type: "",
        aPartenariat: false,
        etablissement: "",
        duree: "",
        pays: "",
      },
      stages: [],
      diplomes: [],
      electifs: [],
    },
  });

  const [currentStage, setCurrentStage] = useState({
    nom_d_entreprise: "",
    annee_du_stage: "",
    duree_du_stage: "",
    poste: "",
  });

  const [currentDiplome, setCurrentDiplome] = useState({
    nom: "",
    annee_d_obtention: "",
  });

  const [currentElectif, setCurrentElectif] = useState({
    type_electif: "",
    etablissement_electif: "",
    semestre_d_electif: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEtudiant((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleParcoursChange = (e) => {
    const { name, value } = e.target;
    setEtudiant((prevState) => ({
      ...prevState,
      Parcours: {
        ...prevState.Parcours,
        [name]: value,
      },
    }));
  };

  const handleAutreParcoursChange = (e) => {
    const { name, value } = e.target;
    setEtudiant((prevState) => ({
      ...prevState,
      Parcours: {
        ...prevState.Parcours,
        autre_parcours_diplomant: {
          ...prevState.Parcours.autre_parcours_diplomant,
          [name]: value,
        },
      },
    }));
  };

  const handleAddStage = () => {
    setEtudiant((prevState) => ({
      ...prevState,
      Parcours: {
        ...prevState.Parcours,
        stages: [...prevState.Parcours.stages, currentStage],
      },
    }));
    setCurrentStage({
      nom_d_entreprise: "",
      annee_du_stage: "",
      duree_du_stage: "",
      poste: "",
    });
  };

  const handleAddDiplome = () => {
    setEtudiant((prevState) => ({
      ...prevState,
      Parcours: {
        ...prevState.Parcours,
        diplomes: [...prevState.Parcours.diplomes, currentDiplome],
      },
    }));
    setCurrentDiplome({
      nom: "",
      annee_d_obtention: "",
    });
  };

  const handleAddElectif = () => {
    setEtudiant((prevState) => ({
      ...prevState,
      Parcours: {
        ...prevState.Parcours,
        electifs: [...prevState.Parcours.electifs, currentElectif],
      },
    }));
    setCurrentElectif({
      type_electif: "",
      etablissement_electif: "",
      semestre_d_electif: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${process.env.BACKEND}/api/students/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(etudiant),
      });
      if (res.ok) {
        const data = await res.json();
        // Handle success (e.g., redirect or display a message)
      } else {
        // Handle error
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Add New Student</h1>
      <form onSubmit={handleSubmit}>
        {/* Personal Information */}
        <h2 className="text-xl font-semibold mb-2">Personal Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* nom */}
          <div>
            <label className="block text-gray-700">Nom</label>
            <input
              type="text"
              name="nom"
              value={etudiant.nom}
              onChange={handleInputChange}
              className="border rounded w-full py-2 px-3"
            />
          </div>
          {/* prenom */}
          <div>
            <label className="block text-gray-700">Prenom</label>
            <input
              type="text"
              name="prenom"
              value={etudiant.prenom}
              onChange={handleInputChange}
              className="border rounded w-full py-2 px-3"
            />
          </div>
          {/* Date_de_naissance */}
          <div>
            <label className="block text-gray-700">Date de Naissance</label>
            <input
              type="date"
              name="Date_de_naissance"
              value={etudiant.Date_de_naissance}
              onChange={handleInputChange}
              className="border rounded w-full py-2 px-3"
            />
          </div>
          {/* annee_d_entree */}
          <div>
            <label className="block text-gray-700">Annee d'Entree</label>
            <input
              type="date"
              name="annee_d_entree"
              value={etudiant.annee_d_entree}
              onChange={handleInputChange}
              className="border rounded w-full py-2 px-3"
            />
          </div>
          {/* mail */}
          <div>
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              name="mail"
              value={etudiant.mail}
              onChange={handleInputChange}
              className="border rounded w-full py-2 px-3"
            />
          </div>
          {/* Genre */}
          <div>
            <label className="block text-gray-700">Genre</label>
            <select
              name="Genre"
              value={etudiant.Genre}
              onChange={handleInputChange}
              className="border rounded w-full py-2 px-3"
            >
              <option value="">Select Genre</option>
              <option value={true}>Male</option>
              <option value={false}>Female</option>
            </select>
          </div>
        </div>

        {/* Parcours */}
        <h2 className="text-xl font-semibold mt-6 mb-2">Parcours</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* type_de_bac */}
          <div>
            <label className="block text-gray-700">Type de Bac</label>
            <input
              type="text"
              name="type_de_bac"
              value={etudiant.Parcours.type_de_bac}
              onChange={handleParcoursChange}
              className="border rounded w-full py-2 px-3"
            />
          </div>
          {/* filiere_d_origine */}
          <div>
            <label className="block text-gray-700">Filiere d'Origine</label>
            <input
              type="text"
              name="filiere_d_origine"
              value={etudiant.Parcours.filiere_d_origine}
              onChange={handleParcoursChange}
              className="border rounded w-full py-2 px-3"
            />
          </div>
          {/* prepa_d_origine */}
          <div>
            <label className="block text-gray-700">Prepa d'Origine</label>
            <input
              type="text"
              name="prepa_d_origine"
              value={etudiant.Parcours.prepa_d_origine}
              onChange={handleParcoursChange}
              className="border rounded w-full py-2 px-3"
            />
          </div>
          {/* mode_d_admission */}
          <div>
            <label className="block text-gray-700">Mode d'Admission</label>
            <select
              name="mode_d_admission"
              value={etudiant.Parcours.mode_d_admission}
              onChange={handleParcoursChange}
              className="border rounded w-full py-2 px-3"
            >
              <option value="">Select Mode</option>
              <option value="AST">AST</option>
              <option value="Mines-Pont">Mines-Pont</option>
              <option value="EM">EM</option>
              <option value="FAC">FAC</option>
            </select>
          </div>
          {/* est_fusion */}
          <div>
            <label className="block text-gray-700">Est Fusion</label>
            <select
              name="est_fusion"
              value={etudiant.Parcours.est_fusion}
              onChange={(e) =>
                setEtudiant((prevState) => ({
                  ...prevState,
                  Parcours: {
                    ...prevState.Parcours,
                    est_fusion: e.target.value === "true",
                  },
                }))
              }
              className="border rounded w-full py-2 px-3"
            >
              <option value="">Select</option>
              <option value={true}>Yes</option>
              <option value={false}>No</option>
            </select>
          </div>
        </div>

        {/* Autre Parcours Diplomant */}
        <h3 className="text-lg font-semibold mt-4 mb-2">
          Autre Parcours Diplomant
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* type */}
          <div>
            <label className="block text-gray-700">Type</label>
            <input
              type="text"
              name="type"
              value={etudiant.Parcours.autre_parcours_diplomant.type}
              onChange={handleAutreParcoursChange}
              className="border rounded w-full py-2 px-3"
            />
          </div>
          {/* aPartenariat */}
          <div>
            <label className="block text-gray-700">A Partenariat</label>
            <select
              name="aPartenariat"
              value={etudiant.Parcours.autre_parcours_diplomant.aPartenariat}
              onChange={(e) =>
                setEtudiant((prevState) => ({
                  ...prevState,
                  Parcours: {
                    ...prevState.Parcours,
                    autre_parcours_diplomant: {
                      ...prevState.Parcours.autre_parcours_diplomant,
                      aPartenariat: e.target.value === "true",
                    },
                  },
                }))
              }
              className="border rounded w-full py-2 px-3"
            >
              <option value="">Select</option>
              <option value={true}>Yes</option>
              <option value={false}>No</option>
            </select>
          </div>
          {/* etablissement */}
          <div>
            <label className="block text-gray-700">Etablissement</label>
            <input
              type="text"
              name="etablissement"
              value={etudiant.Parcours.autre_parcours_diplomant.etablissement}
              onChange={handleAutreParcoursChange}
              className="border rounded w-full py-2 px-3"
            />
          </div>
          {/* duree */}
          <div>
            <label className="block text-gray-700">Duree</label>
            <input
              type="text"
              name="duree"
              value={etudiant.Parcours.autre_parcours_diplomant.duree}
              onChange={handleAutreParcoursChange}
              className="border rounded w-full py-2 px-3"
            />
          </div>
          {/* pays */}
          <div>
            <label className="block text-gray-700">Pays</label>
            <input
              type="text"
              name="pays"
              value={etudiant.Parcours.autre_parcours_diplomant.pays}
              onChange={handleAutreParcoursChange}
              className="border rounded w-full py-2 px-3"
            />
          </div>
        </div>

        {/* Stages */}
        <h3 className="text-lg font-semibold mt-4 mb-2">Stages</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* nom_d_entreprise */}
          <div>
            <label className="block text-gray-700">Nom d'Entreprise</label>
            <input
              type="text"
              name="nom_d_entreprise"
              value={currentStage.nom_d_entreprise}
              onChange={(e) =>
                setCurrentStage({
                  ...currentStage,
                  nom_d_entreprise: e.target.value,
                })
              }
              className="border rounded w-full py-2 px-3"
            />
          </div>
          {/* annee_du_stage */}
          <div>
            <label className="block text-gray-700">Annee du Stage</label>
            <input
              type="date"
              name="annee_du_stage"
              value={currentStage.annee_du_stage}
              onChange={(e) =>
                setCurrentStage({
                  ...currentStage,
                  annee_du_stage: e.target.value,
                })
              }
              className="border rounded w-full py-2 px-3"
            />
          </div>
          {/* duree_du_stage */}
          <div>
            <label className="block text-gray-700">Duree du Stage</label>
            <input
              type="text"
              name="duree_du_stage"
              value={currentStage.duree_du_stage}
              onChange={(e) =>
                setCurrentStage({
                  ...currentStage,
                  duree_du_stage: e.target.value,
                })
              }
              className="border rounded w-full py-2 px-3"
            />
          </div>
          {/* poste */}
          <div>
            <label className="block text-gray-700">Poste</label>
            <input
              type="text"
              name="poste"
              value={currentStage.poste}
              onChange={(e) =>
                setCurrentStage({ ...currentStage, poste: e.target.value })
              }
              className="border rounded w-full py-2 px-3"
            />
          </div>
        </div>
        {/* Button to add stage */}
        <button
          type="button"
          onClick={handleAddStage}
          className="mt-2 bg-green-500 text-white py-2 px-4 rounded"
        >
          Add Stage
        </button>
        {/* Display list of added stages */}
        {etudiant.Parcours.stages.length > 0 && (
          <ul className="mt-2">
            {etudiant.Parcours.stages.map((stage, index) => (
              <li key={index}>
                {stage.nom_d_entreprise} - {stage.poste}
              </li>
            ))}
          </ul>
        )}

        {/* Diplomes */}
        <h3 className="text-lg font-semibold mt-4 mb-2">Diplomes</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* nom */}
          <div>
            <label className="block text-gray-700">Nom</label>
            <input
              type="text"
              name="nom"
              value={currentDiplome.nom}
              onChange={(e) =>
                setCurrentDiplome({ ...currentDiplome, nom: e.target.value })
              }
              className="border rounded w-full py-2 px-3"
            />
          </div>
          {/* annee_d_obtention */}
          <div>
            <label className="block text-gray-700">Annee d'Obtention</label>
            <input
              type="date"
              name="annee_d_obtention"
              value={currentDiplome.annee_d_obtention}
              onChange={(e) =>
                setCurrentDiplome({
                  ...currentDiplome,
                  annee_d_obtention: e.target.value,
                })
              }
              className="border rounded w-full py-2 px-3"
            />
          </div>
        </div>
        {/* Button to add diplome */}
        <button
          type="button"
          onClick={handleAddDiplome}
          className="mt-2 bg-green-500 text-white py-2 px-4 rounded"
        >
          Add Diplome
        </button>
        {/* Display list of added diplomes */}
        {etudiant.Parcours.diplomes.length > 0 && (
          <ul className="mt-2">
            {etudiant.Parcours.diplomes.map((diplome, index) => (
              <li key={index}>
                {diplome.nom} - {diplome.annee_d_obtention}
              </li>
            ))}
          </ul>
        )}

        {/* Electifs */}
        <h3 className="text-lg font-semibold mt-4 mb-2">Electifs</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* type_electif */}
          <div>
            <label className="block text-gray-700">Type Electif</label>
            <input
              type="text"
              name="type_electif"
              value={currentElectif.type_electif}
              onChange={(e) =>
                setCurrentElectif({
                  ...currentElectif,
                  type_electif: e.target.value,
                })
              }
              className="border rounded w-full py-2 px-3"
            />
          </div>
          {/* etablissement_electif */}
          <div>
            <label className="block text-gray-700">Etablissement Electif</label>
            <input
              type="text"
              name="etablissement_electif"
              value={currentElectif.etablissement_electif}
              onChange={(e) =>
                setCurrentElectif({
                  ...currentElectif,
                  etablissement_electif: e.target.value,
                })
              }
              className="border rounded w-full py-2 px-3"
            />
          </div>
          {/* semestre_d_electif */}
          <div>
            <label className="block text-gray-700">Semestre d'Electif</label>
            <input
              type="text"
              name="semestre_d_electif"
              value={currentElectif.semestre_d_electif}
              onChange={(e) =>
                setCurrentElectif({
                  ...currentElectif,
                  semestre_d_electif: e.target.value,
                })
              }
              className="border rounded w-full py-2 px-3"
            />
          </div>
        </div>
        {/* Button to add electif */}
        <button
          type="button"
          onClick={handleAddElectif}
          className="mt-2 bg-green-500 text-white py-2 px-4 rounded"
        >
          Add Electif
        </button>
        {/* Display list of added electifs */}
        {etudiant.Parcours.electifs.length > 0 && (
          <ul className="mt-2">
            {etudiant.Parcours.electifs.map((electif, index) => (
              <li key={index}>
                {electif.type_electif} - {electif.etablissement_electif}
              </li>
            ))}
          </ul>
        )}

        {/* Submit button */}
        <button
          type="submit"
          className="mt-6 bg-blue-500 text-white py-2 px-4 rounded"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
