import { GridColDef } from '@material-ui/data-grid';
import { CoffeeOrigin } from './Coffee';

export class CoffeeOrigins {
  constructor(private coffeeOrigins: CoffeeOrigin[]) {}

  //methodName(): ReturnType { methodBody;}
  getColumns(): GridColDef[] {
    const coffeeOrigin = this.coffeeOrigins[0];
    if (!coffeeOrigin) return [];

    const keys = Object.keys(coffeeOrigin);
    return keys.map(key => {
      return {
        field: key,
        headerName: key
      };
    });
  }

  getRows() {
    return this.coffeeOrigins.map((coffeeOrigin, id) => {
      return {
        id,
        ...coffeeOrigin
      };
    });
  }
}
