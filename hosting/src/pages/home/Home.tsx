import { Theme } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { ClassNameMap, Styles } from '@material-ui/core/styles/withStyles';
import React, { useEffect, useState } from 'react';
import { db } from '../../firebase/firebase';

interface Label {
  location?: string;
}

// eslint-disable-next-line @typescript-eslint/ban-types
const styles: Styles<Theme, {}, string> = () => ({
  title: {
    color: 'blue',
    textAlign: 'center'
  }
});

type HomeInput = { classes: ClassNameMap<string> };
export const Home = withStyles(styles)(
  ({ classes }: HomeInput): JSX.Element => {
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
      <div>
        <h1 className={classes.title}>Welcome!</h1>
        {firstLabel?.location && `First label is at: ${firstLabel.location}`}
      </div>
    );
  }
);
