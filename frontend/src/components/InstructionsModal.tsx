import type { TidyRecipe } from "../types/recipe";
import Modal from "./Modal";

interface InstructionsModalProps {
  recipe: TidyRecipe | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function InstructionsModal({ recipe, isOpen, onClose }: InstructionsModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={recipe?.name || ""}>
      {recipe && (
        <ol className="flex flex-col gap-2">
          {recipe.instructions.map((instruction, index) => (
            <li key={index} className="list-item flex gap-3">
              <span className="text-accent-mint font-medium">{index + 1}.</span>
              <span>{instruction}</span>
            </li>
          ))}
        </ol>
      )}
    </Modal>
  );
}
