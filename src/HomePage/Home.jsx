import { useEffect, useState } from "react";
import Card from "../components/Card/Card";
import styles from "./Home.module.css";
import TransactionList from "../components/TransactionList/TransactionList";
import ExpenseForm from "../components/Forms/ExpenseForm/ExpenseForm";
import Modal from "../components/Modal/Modal";
import AddBalanceForm from "../components/Forms/AddBalanceForm/AddBalanceForm";
import PieChart from "../components/PieChart/PieChart";
import BarChart from "../components/BarChart/BarChart";

export default function Home() {
  // States
  const [balance, setBalance] = useState(0);
  const [expense, setExpense] = useState(0);
  const [expenseList, setExpenseList] = useState([]);
  const [isMounted, setIsMounted] = useState(false);

  // Modal visibility states
  const [isOpenExpense, setIsOpenExpense] = useState(false);
  const [isOpenBalance, setIsOpenBalance] = useState(false);

  // Category tracking states
  const [categorySpends, setCategorySpends] = useState({
    food: 0,
    entertainment: 0,
    travel: 0,
  });
  const [categoryCount, setCategoryCount] = useState({
    food: 0,
    entertainment: 0,
    travel: 0,
  });

  // Initialize balance and expense list from localStorage
  useEffect(() => {
    const localBalance = localStorage.getItem("balance");
    setBalance(localBalance ? Number(localBalance) : 5000);

    const items = JSON.parse(localStorage.getItem("expenses"));
    setExpenseList(items || []);

    setIsMounted(true); // Mark component as mounted
  }, []);

  // Update localStorage and derived states when expenseList changes
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("expenses", JSON.stringify(expenseList));
    }

    // Calculate total expense
    const totalExpense = expenseList.reduce(
      (acc, item) => acc + Number(item.price),
      0
    );
    setExpense(totalExpense);

    // Calculate category spends and counts
    const categoryData = expenseList.reduce(
      (acc, item) => {
        acc.spends[item.category] += Number(item.price);
        acc.counts[item.category]++;
        return acc;
      },
      {
        spends: { food: 0, entertainment: 0, travel: 0 },
        counts: { food: 0, entertainment: 0, travel: 0 },
      }
    );

    setCategorySpends(categoryData.spends);
    setCategoryCount(categoryData.counts);
  }, [expenseList, isMounted]);

  // Save balance to localStorage when it changes
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("balance", balance);
    }
  }, [balance, isMounted]);

  return (
    <div className={styles.container}>
      <h1>Expense Tracker</h1>

      {/* Cards and Pie Chart Section */}
      <div className={styles.cardsWrapper}>
        <Card
          title="Wallet Balance"
          money={balance}
          buttonText="+ Add Income"
          buttonType="success"
          handleClick={() => setIsOpenBalance(true)}
        />

        <Card
          title="Expenses"
          money={expense}
          buttonText="+ Add Expense"
          buttonType="failure"
          success={false}
          handleClick={() => setIsOpenExpense(true)}
        />

        <PieChart
          data={[
            { name: "Food", value: categorySpends.food },
            { name: "Entertainment", value: categorySpends.entertainment },
            { name: "Travel", value: categorySpends.travel },
          ]}
        />
      </div>

      {/* Transactions and Bar Chart Section */}
      <div className={styles.transactionsWrapper}>
        <TransactionList
          transactions={expenseList}
          editTransactions={setExpenseList}
          title="Recent Transactions"
          balance={balance}
          setBalance={setBalance}
        />

        <BarChart
          data={[
            { name: "Food", value: categoryCount.food },
            { name: "Entertainment", value: categoryCount.entertainment },
            { name: "Travel", value: categoryCount.travel },
          ]}
        />
      </div>

      {/* Modals */}
      <Modal isOpen={isOpenExpense} setIsOpen={setIsOpenExpense}>
        <ExpenseForm
          setIsOpen={setIsOpenExpense}
          expenseList={expenseList}
          setExpenseList={setExpenseList}
          setBalance={setBalance}
          balance={balance}
        />
      </Modal>

      <Modal isOpen={isOpenBalance} setIsOpen={setIsOpenBalance}>
        <AddBalanceForm setIsOpen={setIsOpenBalance} setBalance={setBalance} />
      </Modal>
    </div>
  );
}
