import React, { useEffect, useState } from 'react';
import './App.css';
import { db } from './firebase/firebase';
import logo from './logo.svg';

interface Label {
  location?: string;
}

function App(): JSX.Element {
  const [firstLabel, setFirstLabel] = useState<Label>({});
  const unsubscribers: (() => void)[] = [];

  useEffect(() => {
    const getFirstLabel = async () => {
      const unsubscribe = db
        .collection('labels')
        .doc('first')
        .onSnapshot(snapshot => {
          console.log({ snapshot });
          setFirstLabel(snapshot.data() as Label);
        });
      unsubscribers.push(unsubscribe);
    };
    getFirstLabel().catch(ex => console.error(ex));

    return () => unsubscribers.forEach(u => u());
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          {firstLabel?.location && `First label is at: ${firstLabel.location}`}
        </p>
      </header>
    </div>
  );
}

export default App;
