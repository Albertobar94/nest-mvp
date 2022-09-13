import { databaseExceptionsMessages } from "./db-exception-messages";

type errorMapperResponse = [number, string | null];

export const databaseExceptionMapper = (err: Error): errorMapperResponse => {
  let message: string | null = null;
  let status = 500;

  const messageMapperKeys = Object.keys(databaseExceptionsMessages) as Array<
    keyof typeof databaseExceptionsMessages
  >;

  messageMapperKeys.forEach((subStr) => {
    if (err.message.indexOf(subStr) !== -1) {
      status = databaseExceptionsMessages[subStr]?.status;
      message = databaseExceptionsMessages[subStr]?.message;
    }
  });

  return [status, message];
};
