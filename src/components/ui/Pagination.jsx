import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import CustomButton from "./Button";

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  const getPageNumbers = () => {
    const pages = [];

    pages.push(currentPage);

    if (currentPage > 1) {
      if (currentPage > 2) {
        pages.unshift(1);
        if (currentPage > 3) {
          pages.splice(1, 0, "ellipsis");
        }
      }
      pages.unshift(currentPage - 1);
    }

    if (currentPage < totalPages) {
      pages.push(currentPage + 1);
      if (currentPage < totalPages - 1) {
        if (currentPage < totalPages - 2) {
          pages.push("ellipsis");
        }
        pages.push(totalPages);
      }
    }
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <nav className="flex justify-center items-center space-x-2 mt-8">
      <CustomButton
        variant="clear"
        size="icon"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="h-9 w-9 rounded-full !border-neutral-border !hover:bg-gray-200"
      >
        <FiChevronLeft className="h-4 w-4" />
        <span className="sr-only">Previous page</span>
      </CustomButton>

      {pageNumbers.map((page, index) =>
        page === "ellipsis" ? (
          <span key={`ellipsis-${index}`} className="px-3 py-2">
            ...
          </span>
        ) : (
          <CustomButton
            key={`page-${page}`}
            variant={currentPage === page ? "default" : "clear"}
            size="icon"
            onClick={() => typeof page === "number" && onPageChange(page)}
            className={`h-9 w-9 !border-neutral-border rounded-full ${
              currentPage === page ? "!bg-neutral-black text-white" : "!hover:bg-gray-200"
            }`}
          >
            {page}
          </CustomButton>
        )
      )}

      <CustomButton
        variant="clear"
        size="icon"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="h-9 w-9 rounded-full !border-neutral-border !hover:bg-gray-200"
      >
        <FiChevronRight className="h-4 w-4" />
        <span className="sr-only">Next page</span>
      </CustomButton>
    </nav>
  );
}
