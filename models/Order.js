import { Schema, models, model} from "mongoose";

const OrderSchema = new Schema({
    line_items:Object,
    name:String,
    email:String,
    city:String,
    streetAddress:String,
    address:String,
    paid:Boolean,
}, {
    timestamps: true,
});

export const Order = models?.Order || model('Order', OrderSchema);