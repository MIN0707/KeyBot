import {Model, model,Schema} from "mongoose";

export interface Ikey {
    key: string;
    issuer: string;
    date: number;
}

const keySchema = new Schema<Ikey>({
    key: {type: String, required: true},
    issuer: {type: String, required: true},
    date: {type: Number, required: true},
});

const Mongo:Model<Ikey> = model('key', keySchema);

export default Mongo;