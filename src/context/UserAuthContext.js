import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth, db } from "../firebase";
import { addDoc, collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { async } from "@firebase/util";
const userAuthContext = createContext();

export function UserAuthContextProvider({ children }) {
  const [user, setUser] = useState({});
  const [Money, setMoney] = useState(0)
  const [currentUser, setCurrentUser] = useState(auth.currentUser);
  function logIn(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }
  function signUp(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }
  function logOut() {
    setTransacitonType('deposit')
    return signOut(auth);
  }
  function googleSignIn() {
    const googleAuthProvider = new GoogleAuthProvider();
    return signInWithPopup(auth, googleAuthProvider);
  }
  const [transactionName, setTransactionName] = useState('');
  const [transactionType, setTransacitonType] = useState('deposit');
  const [price, setPrice] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [total, setTotal] = useState(0);

  const findTotal = () => {
    let x = 0;
    transactions.map((transac) => {
      if (auth.currentUser !== null && transac.email === auth.currentUser.email) {
        if (transac.transactionType === "expense") {
          x = x - parseInt(transac.price, 10);;
        }
        else {
          x += parseInt(transac.price, 10);
        }
      }
    })
    setTotal(x);
  }
  const createTransactions = async () => {
    await addDoc(transactionsCollectionRef, {
      email: auth.currentUser.email,
      transactionType: transactionType,
      transactionName: transactionName,
      price: price,
    })
  }
  const addTransaction = (e) => {
    e.preventDefault();
    const myTransaction = {
      email: auth.currentUser.email,
      transactionType: transactionType,
      transactionName: transactionName,
      price: price,
    }
    setTransactions([...transactions, myTransaction]);
    createTransactions();
    getTransc();
  }
  const transactionsCollectionRef = collection(db, "Transactions");
  const getTransc = async () => {
    const data = await getDocs(transactionsCollectionRef);
    setTransactions(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  }
  useEffect(() => {
    getTransc();
  }, [])

  useEffect(() => {
    findTotal();
  }, [transactions])
  const delteTransactionFirebase = async (id) => {
    const transcDoc = doc(db, "Transactions", id);
    await deleteDoc(transcDoc)
  }
  const deleteTransaction = (transc, e) => {
    e.preventDefault();
    setTransactions(transactions.filter((e) => { return e !== transc }))
    delteTransactionFirebase(transc.id)

  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentuser) => {

      console.log("Auth", currentuser);
      setUser(currentuser);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <userAuthContext.Provider
      value={{ user, logIn, signUp, logOut, googleSignIn, currentUser, total, setTransactionName, setTransacitonType, setPrice, addTransaction, transactions, deleteTransaction, transactionName }}
    >
      {children}
    </userAuthContext.Provider>
  );
}

export function useUserAuth() {
  return useContext(userAuthContext);
}
