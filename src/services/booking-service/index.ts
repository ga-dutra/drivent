import { notFoundError } from "@/errors";
import bookingRepository from "@/repositories/booking-repository";
import { exclude } from "@/utils/prisma-utils";

async function getBookingByUserId(userId: number)  {
  const booking = await bookingRepository.findBookingByUserId(userId);

  if (!booking) {
    throw notFoundError();
  }

  return exclude(booking, "createdAt", "updatedAt", "roomId", "userId");
}

const bookingService = {
  getBookingByUserId,
};

export default bookingService;
