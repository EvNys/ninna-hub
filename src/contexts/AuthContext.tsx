import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

interface AuthContextType {
  user: User | null;
  userData: any | null;
  isAdmin: boolean;
  isEditor: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userData: null,
  isAdmin: false,
  isEditor: false,
  loading: true,
});

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

function handleFirestoreError(error: any, operationType: OperationType, path: string | null) {
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<any | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEditor, setIsEditor] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribeSnapshot: () => void = () => {};

    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        if (unsubscribeSnapshot) unsubscribeSnapshot();

        const userPath = `users/${currentUser.uid}`;
        // Ensure we wait for the snapshot before setting loading to false
        unsubscribeSnapshot = onSnapshot(doc(db, 'users', currentUser.uid), (docSnap) => {
          const data = docSnap.data();
          setUserData(data || null);
          const isUserAdmin = data?.role === 'admin' || 
                            (currentUser.email === 'adm@ninnahub.com.br') ||
                            (currentUser.email === 'ninnaventures@gmail.com');
          setIsAdmin(isUserAdmin);
          setIsEditor(data?.role === 'editor' || isUserAdmin);
          setLoading(false);
        }, (error) => {
          handleFirestoreError(error, OperationType.GET, userPath);
          // Fallback logic
          const isFailsafe = currentUser.email === 'adm@ninnahub.com.br' || 
                          currentUser.email === 'ninnaventures@gmail.com';
          setIsAdmin(isFailsafe);
          setIsEditor(isFailsafe);
          setLoading(false);
        });
      } else {
        setIsAdmin(false);
        setIsEditor(false);
        setUserData(null);
        setLoading(false);
        if (unsubscribeSnapshot) unsubscribeSnapshot();
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeSnapshot) unsubscribeSnapshot();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, userData, isAdmin, isEditor, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
