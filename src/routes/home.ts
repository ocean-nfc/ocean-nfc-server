import { RouteDocumentationGenerator } from './../classes/route-documentation-generator';
import * as express from "express";
import * as fs from "fs";
import * as marked from "marked";

/**
 * Provides documentation for the API endpoints
 * @param req 
 * @param res 
 * @param next 
 */
export const home: express.Handler = (req, res, next) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="ie=edge">
      <title>Ocean NFC</title>
      <style>
        body {
          font-family: sans-serif;
          margin: 20px;
        }
        td,
        th {
          padding: 10px 20px;
          text-align: left;
        }
        th {
          background-color: #666;
          color: #fff;
        }
        tr:nth-child(odd) {
          background-color: #eee;
        }

        h1 {
          font-size: 48px;
        }
        h2 {
          font-size: 36px;
          margin-top: 100px;
        }
        h3 {
          font-size: 24px;
          margin-top: 50px;
        }
        ul {
          width: 600px;
          max-width: 100%;
        }
      </style>
    </head>
    <body>
      ${marked(RouteDocumentationGenerator.generate())}
    </body>
    </html>
  `);
  next();
};
