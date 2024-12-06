import { memo } from "react";
import { DéfiEtMajeure } from "@/interfaces/students";

interface DéfiEtMajeureCardProps {
  defiEtMajeure: DéfiEtMajeure;
}

const DéfiEtMajeureCard: React.FC<DéfiEtMajeureCardProps> = memo(
  ({ defiEtMajeure }) => {
    return (
      <div className="mt-4 p-4 bg-gray-50 rounded-lg shadow-inner">
        <h3 className="text-xl font-semibold">Défi:</h3>
        <p className="mt-2">{defiEtMajeure.défi}</p>

        {defiEtMajeure.majeures && defiEtMajeure.majeures.length > 0 && (
          <div className="mt-4">
            <h4 className="text-lg font-semibold">Majeures:</h4>
            <ul className="list-disc list-inside mt-2">
              {defiEtMajeure.majeures.map((majeure, idx) => (
                <li key={idx}>
                  <strong>Nom:</strong> {majeure.nom}, <strong>Promo:</strong>{" "}
                  {majeure.promo}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }
);

export default DéfiEtMajeureCard;
