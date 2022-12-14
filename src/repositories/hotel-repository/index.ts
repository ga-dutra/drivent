import { prisma } from "@/config";

async function findHotels() {
  return await prisma.hotel.findMany();
}

async function findHotelById(hotelId: number) {
  return await prisma.hotel.findFirst({
    where: {
      id: hotelId
    }
  });
}

async function findRoomsByHotelId(hotelId: number) {
  return await prisma.room.findMany({
    where: {
      hotelId
    }
  });
}

const hotelRepository = {
  findHotels,
  findHotelById,
  findRoomsByHotelId,
};

export default hotelRepository;
