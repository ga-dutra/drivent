import { notFoundError } from "@/errors";
import hotelRepository from "@/repositories/hotel-repository";

async function getHotels() {
  const hotels = await hotelRepository.findHotels();
  if (!hotels) {
    throw notFoundError();
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

async function getRoomsByHotelId(hotelId: number) {
  const rooms = await hotelRepository.findRoomsByHotelId(hotelId);

  if (!rooms) {
    throw notFoundError();
  }
  return rooms;
}

const hotelService = {
  getHotels,
  getHotelById,
  getRoomsByHotelId,
};

export default hotelService;
