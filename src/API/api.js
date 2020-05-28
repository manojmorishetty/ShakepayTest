import { transactionsHistory } from "Data/transactions.js";

export const getRates = () => {
  debugger;
  return fetch(`https://api.shakepay.co/rates`, {
    method: "GET",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    redirect: "follow",
    referrer: "no-referrer",
  })
    .then((response) => response.json())
    .catch((err) => {
      return err;
    });
};

export const getTransactionsHistory = () => {
  return transactionsHistory;
};
