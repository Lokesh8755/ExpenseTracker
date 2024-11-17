import PropTypes from "prop-types";
import { IoIosArrowRoundBack, IoIosArrowRoundForward } from "react-icons/io";
import styles from "./Pagination.module.css";

export default function Pagination({ updatePage, currentPage, totalPages }) {
  // Handle moving to the previous page
  const handlePrev = () => {
    if (currentPage > 1) {
      updatePage((prev) => prev - 1);
    }
  };

  // Handle moving to the next page
  const handleNext = () => {
    if (currentPage < totalPages) {
      updatePage((prev) => prev + 1);
    }
  };

  return (
    <div className={styles.paginationWrapper}>
      {/* Previous button */}
      <button onClick={handlePrev} disabled={currentPage === 1}>
        <IoIosArrowRoundBack />
      </button>

      {/* Current page display */}
      <p>{currentPage}</p>

      {/* Next button */}
      <button onClick={handleNext} disabled={currentPage === totalPages}>
        <IoIosArrowRoundForward />
      </button>
    </div>
  );
}

// PropTypes validation for Pagination
Pagination.propTypes = {
  updatePage: PropTypes.func.isRequired, // Function to update the current page
  currentPage: PropTypes.number.isRequired, // The current page number
  totalPages: PropTypes.number.isRequired, // The total number of pages
};
