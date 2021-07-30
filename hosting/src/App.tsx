import React, { useEffect, useState } from 'react';
import './App.css';
import { db } from './firebase/firebase';
import logo from './logo.svg';

interface Label {
  location?: string;
}

function App() {
  const [firstLabel, setFirstLabel] = useState<Label>({});
  const unsubscribers: (() => void)[] = [];

  useEffect(() => {
    const getFirstLabel = async () => {
      const unsubscribe = db
        .collection('labels')
        .doc('first')
        .onSnapshot((snapshot) => {
          console.log({ snapshot });
          setFirstLabel(snapshot.data() as Label);
        });
      // const firstLabel = await db.collection('labels').doc('first').get();
      // console.log({ firstLabel: firstLabel.data() });
      // setFirstLabel(firstLabel.data() as Label);
      unsubscribers.push(unsubscribe);
    };
    getFirstLabel();

    return () => unsubscribers.forEach((u) => u());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  console.log('this is a react app developed in typescript!');
  return (
    <div className='App'>
      <header className='App-header'>
        <img src={logo} className='App-logo' alt='logo' />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className='App-link'
          href='https://reactjs.org'
          target='_blank'
          rel='noopener noreferrer'
        >
          Learn React
        </a>
        <p>
          {firstLabel?.location && `First label is at: ${firstLabel.location}`}
        </p>
      </header>
    </div>
  );
}

export default App;
