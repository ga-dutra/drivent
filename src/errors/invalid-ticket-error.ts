import { ApplicationError } from "@/protocols";

export function invalidTicketError(): ApplicationError {
  return {
    name: "InvalidTicketError",
    message: "Ticket is not valid!",
  };
}
