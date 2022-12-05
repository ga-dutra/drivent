import { ApplicationError } from "@/protocols";

export function roomIsFullError(): ApplicationError {
  return {
    name: "RoomIsFullError",
    message: "Room is already full!",
  };
}
