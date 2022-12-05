import { notFoundError } from "@/errors";
import bookingRepository from "@/repositories/booking-repository";
import ticketRepository from "@/repositories/ticket-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import { TicketStatus } from "@prisma/client";
import { exclude } from "@/utils/prisma-utils";
import { roomIsFullError } from "@/errors/room-is-full-error";
import { invalidTicketError } from "@/errors/invalid-ticket-error";

async function getBookingByUserId(userId: number)  {
  const booking = await bookingRepository.findBookingByUserId(userId);

  if (!booking) {
    throw notFoundError();
  }

  return exclude(booking, "createdAt", "updatedAt", "roomId", "userId");
}

async function validateBooking(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    return "enrollmentNotFound";
  }
  const validTicket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);
  if (!validTicket || validTicket.status !== TicketStatus.PAID) {
    return "invalidTicket";
  }
  if (validTicket.TicketType.includesHotel === false || validTicket.TicketType.isRemote === true) {
    return "invalidTicket";
  }
  return true;
}

async function validateRoom(roomId: number) {
  const room = await bookingRepository.findRoomById(roomId);
  if (!room) return "notFound";
  
  const roomBooking = await bookingRepository.findBookingsByRoomId(roomId);
  if (roomBooking.length === room.capacity) return "fullRoom";
  return true;
}

async function postBooking(userId: number, roomId: number): Promise<BookingId> {
  const bookingValidation = await validateBooking(userId);
  
  if (bookingValidation === "enrollmentNotFound") {
    throw notFoundError();
  }
  else if (bookingValidation === "invalidTicket") {
    throw invalidTicketError();
  }
  
  const checkRoom = await validateRoom(roomId);

  if (checkRoom === "notFound") {
    throw notFoundError();
  }

  else if (checkRoom === "fullRoom") {
    throw roomIsFullError();
  }

  return bookingRepository.insertBooking(userId, roomId);
}

async function updateBooking(bookingId: number, roomId: number, userId: number): Promise<BookingId> {
  const bookingValidation = await validateBooking(userId);
  
  if (bookingValidation === "enrollmentNotFound") {
    throw notFoundError();
  }
  else if (bookingValidation === "invalidTicket") {
    throw invalidTicketError();
  }
  
  const checkRoom = await validateRoom(roomId);

  if (checkRoom === "notFound") {
    throw notFoundError();
  }

  else if (checkRoom === "fullRoom") {
    throw roomIsFullError();
  }

  const userBooking = await bookingRepository.findBookingById(bookingId);
  
  if (!userBooking || userBooking.userId !== userId) {
    throw notFoundError();
  }
  return bookingRepository.putBooking(bookingId, roomId);
}

export type BookingId = {
  id: number
};

const bookingService = {
  getBookingByUserId,
  postBooking,
  updateBooking,
};

export default bookingService;
