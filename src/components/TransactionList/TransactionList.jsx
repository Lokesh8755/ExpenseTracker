import { useEffect, useState } from "react";
import PropTypes from "prop-types";

import TransactionCard from "../TransactionsCard/TransactionCard";
import styles from "./TransactionList.module.css";
import Modal from "../Modal/Modal";
import ExpenseForm from "../Forms/ExpenseForm/ExpenseForm";
import Pagination from "../Pagination/Pagination";

export default function TransactionList({
  transactions,
  title,
  editTransactions,
  balance,
  setBalance,
}) {
  const [editId, setEditId] = useState(0);
  const [isDisplayEditor, setIsDisplayEditor] = useState(false);
  const [currentTransactions, setCurrentTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const maxRecords = 3;

  // Handle deleting a transaction
  const handleDelete = (id) => {
    const item = transactions.find((i) => i.id === id);
    if (!item) return;

    const price = Number(item.price);
    setBalance((prev) => prev + price);
    editTransactions((prev) => prev.filter((item) => item.id !== id));
  };

  // Handle editing a transaction
  const handleEdit = (id) => {
    setEditId(id);
    setIsDisplayEditor(true);
  };

  // Update current transactions and total pages based on pagination
  useEffect(() => {
    const startIndex = (currentPage - 1) * maxRecords;
    const endIndex = Math.min(currentPage * maxRecords, transactions.length);

    setCurrentTransactions(transactions.slice(startIndex, endIndex));
    setTotalPages(Math.ceil(transactions.length / maxRecords));
  }, [currentPage, transactions]);

  // Ensure currentPage is valid when transactions are updated
  useEffect(() => {
    if (currentPage > totalPages && currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  }, [totalPages, currentPage]);

  return (
    <div className={styles.transactionsWrapper}>
      {title && <h2>{title}</h2>}

      {transactions.length > 0 ? (
        <div className={styles.list}>
          {/* Display transaction cards */}
          <div>
            {currentTransactions.map((transaction) => (
              <TransactionCard
                key={transaction.id}
                details={transaction}
                handleDelete={() => handleDelete(transaction.id)}
                handleEdit={() => handleEdit(transaction.id)}
              />
            ))}
          </div>

          {/* Display pagination if multiple pages */}
          {totalPages > 1 && (
            <Pagination
              updatePage={setCurrentPage}
              currentPage={currentPage}
              totalPages={totalPages}
            />
          )}
        </div>
      ) : (
        <div className={styles.emptyTransactionsWrapper}>
          <p>No transactions!</p>
        </div>
      )}

      {/* Modal for editing transactions */}
      <Modal isOpen={isDisplayEditor} setIsOpen={setIsDisplayEditor}>
        <ExpenseForm
          editId={editId}
          expenseList={transactions}
          setExpenseList={editTransactions}
          setIsOpen={setIsDisplayEditor}
          balance={balance}
          setBalance={setBalance}
        />
      </Modal>
    </div>
  );
}

// PropTypes for TransactionList
TransactionList.propTypes = {
  transactions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    })
  ).isRequired,
  title: PropTypes.string,
  editTransactions: PropTypes.func.isRequired,
  balance: PropTypes.number.isRequired,
  setBalance: PropTypes.func.isRequired,
};
