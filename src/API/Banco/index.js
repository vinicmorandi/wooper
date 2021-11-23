import express from "express";
import cors from "cors";
import { createConnection } from "typeorm";
import { graphqlHTTP } from "express-graphql";

var app = express()
app.use(cors())
app.use(express.json())

