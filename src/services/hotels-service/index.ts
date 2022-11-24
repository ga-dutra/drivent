import { notFoundError, unauthorizedError } from "@/errors";
import hotelRepository from "@/repositories/hotel-repository";

async function getHotels() {
  const hotels = await hotelRepository.findHotels();
  if (!hotels) {
    throw notFoundError();
  }
  return hotels;
}

async function getRoomsByHotelId(hotelId: number) {
  const hotel = await hotelRepository.findRoomsByHotelId(hotelId);

  if (!hotel) {
    throw notFoundError();
  }
  return hotel;
}

const hotelService = {
  getHotels,
  getRoomsByHotelId,
};

export default hotelService;
