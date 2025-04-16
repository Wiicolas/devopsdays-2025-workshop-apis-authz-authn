import OrderCreate from "./order-create";
import OrderUpdate from "./order-update";

export default interface Order extends OrderCreate, OrderUpdate {
    id: string;
    createdDate: Date;
}
