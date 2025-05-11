import BeerCreate from "./beer-create";

export default interface Beer extends BeerCreate
 {
    id: string;
    createdDate: Date;
    updatedDate: Date;
}
