import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Chip from '@material-ui/core/Chip';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Typography from '@material-ui/core/Typography';
import getSymbolFromCurrency from 'currency-symbol-map';

export interface CoffeeOrigin {
  label: string;
  id: string;
  weight: Weight;
  price: Price;
}

export interface Weight {
  amount: number;
  unit: string;
}

export interface Price {
  amount: number;
  unit: string;
}

const useStyles = makeStyles({
  root: {
    width: '380px',
    height: '532px'
  },
  media: {
    height: '400px'
  }
});

export const coffeeOriginAsCard = (coffeeOrigin: CoffeeOrigin): JSX.Element => {
  const classes = useStyles();
  return (
    <Card className={classes.root}>
      <CardMedia
        className={classes.media}
        image='https://www.worldatlas.com/upload/12/f8/83/coffee-cup.jpg'
        title='Coffee'
      />
      <CardContent>
        <Typography gutterBottom variant='h5' component='h2'>
          {coffeeOrigin.label}
        </Typography>
      </CardContent>
      <CardActions>
        <Chip
          variant='outlined'
          color='primary'
          label={coffeeOrigin.weight.amount}
          avatar={<Avatar>{coffeeOrigin.weight.unit.toLowerCase()}</Avatar>}
        />
        <Chip
          variant='outlined'
          color='primary'
          label={coffeeOrigin.price.amount}
          avatar={
            <Avatar>{getSymbolFromCurrency(coffeeOrigin.price.unit)}</Avatar>
          }
        />
      </CardActions>
    </Card>
  );
};
