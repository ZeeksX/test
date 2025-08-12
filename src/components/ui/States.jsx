/* eslint-disable react/prop-types */
import { emptyFolderImg } from "../../utils/images";

export function EmptyState({ title, description }) {
  return (
    <div className="w-full h-full gap-1 flex flex-col items-center justify-center">
      <img src={emptyFolderImg || "/placeholder.svg"} alt="" />
      <h3 className="font-medium text-2xl">{title}</h3>
      <h5 className="text-text-ghost font-normal text-sm">{description}</h5>
    </div>
  );
}
