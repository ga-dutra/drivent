import faker from "@faker-js/faker";
import { prisma } from "@/config";

export async function createHotel() {
  return await prisma.hotel.create({
    data: {
      name: faker.name.findName(),
      image: faker.image.image(),
    }
  });
}

export async function createRoom(hotelId: number) {
  return await prisma.room.create({
    data: {
      name: faker.name.findName(),
      capacity: faker.datatype.number({ min: 1, max: 999 }),
      hotelId
    }
  });
}

export async function createRoomWithOneCapacity(hotelId: number) {
  return await prisma.room.create({
    data: {
      name: faker.name.findName(),
      capacity: 1,
      hotelId
    }
  });
}
