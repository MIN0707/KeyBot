import {config} from "dotenv";
import mongoose from 'mongoose';

config();
mongoose.connect('mongodb://127.0.0.1:27017/key')

import Bot from "./src/Bot/Bot";

new Bot().login();
