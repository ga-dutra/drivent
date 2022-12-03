import { notFoundError } from "@/errors";
import { cannotListHotelsError } from "@/errors/cannot-list-hotels-error";
import enrollmentRepository from "@/repositories/enrollment-repository";
import hotelRepository from "@/repositories/hotel-repository";
import ticketRepository from "@/repositories/ticket-repository";

async function getHotels(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  const hotels = await hotelRepository.findHotels();
  if (!hotels || !enrollment) {
    throw notFoundError();
  }

  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);

  if (!ticket || ticket.status === "RESERVED" || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) {
    throw cannotListHotelsError();
  }

  return hotels;
}

async function getHotelById(hotelId: number) {
  const hotel = await hotelRepository.findHotelById(hotelId);
  if (!hotel) {
    throw notFoundError();
  }
  return hotel;
}

async function getRoomsByHotelId(userId: number, hotelId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  const rooms = await hotelRepository.findRoomsByHotelId(hotelId);

  if (!rooms) {
    throw notFoundError();
  }

  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);

  if (!ticket || ticket.status === "RESERVED" || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) {
    throw cannotListHotelsError();
  }
  return rooms;
}

const hotelService = {
  getHotels,
  getHotelById,
  getRoomsByHotelId,
};

export default hotelService;
