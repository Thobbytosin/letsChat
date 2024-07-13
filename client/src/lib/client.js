import axios from "axios";
import { HOST } from "../utils/constants";

const client = axios.create({ baseURL: HOST });

export default client;
