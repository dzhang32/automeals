import type { TidyRecipe } from "../types";

interface InstructionsModalProps {
  recipe: TidyRecipe | null;
}

export default function InstructionsModal({ recipe }: InstructionsModalProps) {
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
          {/* if selected recipe is not null, show the modal */}
          {recipe ? (
            <>
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
                <ol className="list-group list-group-numbered">
                  {recipe.instructions.map((instruction, index) => (
                    <li key={index} className="list-group-item">
                      {instruction}
                    </li>
                  ))}
                </ol>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
