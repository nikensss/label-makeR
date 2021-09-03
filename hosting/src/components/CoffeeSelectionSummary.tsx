import { CoffeeOrigin } from '../firebase/general/coffee/Coffee';

type CoffeeSelectionSummaryProps = {
  coffeeOrigin: CoffeeOrigin | null;
  label: string;
};

export const CoffeeSelectionSummary = ({
  coffeeOrigin,
  label
}: CoffeeSelectionSummaryProps): JSX.Element => {
  console.log({ coffeeOrigin });
  if (!coffeeOrigin) throw new Error('We should not be here');

  return (
    <>
      <div>Summary</div>
      <div>
        {coffeeOrigin.label}, {coffeeOrigin.weight.amount}
      </div>
      <img style={{ width: '380px', height: '532px' }} src={label} />
    </>
  );
};
