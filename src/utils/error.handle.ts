import { Response } from "express";

const handleHttp = (response: Response, error: string, errorRaw?: unknown) => {
  console.log(errorRaw);
  response.status(500);
  response.send({ error });
};

export { handleHttp };
