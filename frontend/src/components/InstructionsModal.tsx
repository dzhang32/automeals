import type { Recipe } from "../types";

interface InstructionsModalProps {
  recipe: Recipe | null;
}

export default function InstructionsModal({ recipe }: InstructionsModalProps) {
  if (!recipe) return null;

  return (
    <div
      className="modal fade"
      id="instructionsModal"
      tabIndex={-1}
      aria-labelledby="instructionsModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="instructionsModalLabel">
              {recipe.name}
            </h1>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <p>{recipe.instructions}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
