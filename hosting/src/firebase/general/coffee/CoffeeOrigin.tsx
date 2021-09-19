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

export const priceDisplay = ({ amount, unit }: Price): string => {
  return `${amount.toFixed(2)} ${getSymbolFromCurrency(unit)}`;
};

export type DisplayableCoffeeOriginKeys = Exclude<keyof CoffeeOrigin, 'id'>;

export class CoffeeOriginRenderer {
  constructor(private coffeeOrigin: CoffeeOrigin) {}

  get label(): string {
    return this.coffeeOrigin.label;
  }

  get weight(): string {
    const { weight } = this.coffeeOrigin;
    return `${weight.amount} ${weight.unit}`;
  }

  get price(): string {
    const { price } = this.coffeeOrigin;
    return `${price.amount} ${getSymbolFromCurrency(price.unit)}`;
  }

  getTotalPrice(quantity: number): string {
    const { price } = this.coffeeOrigin;
    const totalPrice = this.calculateTotalPrice(quantity);

    return `${totalPrice.amount} ${getSymbolFromCurrency(price.unit)}`;
  }

  calculateTotalPrice(quantity: number): Price {
    return {
      amount: this.coffeeOrigin.price.amount * quantity,
      unit: this.coffeeOrigin.price.unit
    };
  }
}

const styles = makeStyles({
  root: {
    width: '380px',
    height: '532px'
  },
  media: {
    height: '400px'
  }
});

export const coffeeOriginAsCard = (coffeeOrigin: CoffeeOrigin): JSX.Element => {
  const classes = styles();
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
