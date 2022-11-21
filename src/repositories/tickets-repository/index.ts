import { prisma } from "@/config";

async function findTicketTypes() {
  return await prisma.ticketType.findMany();
}

async function findTicketTypeById(id: number) {
  return await prisma.ticketType.findUnique({
    where: {
      id
    }
  });
}

async function findTickets() {
  return await prisma.ticket.findFirst();
}

async function findEnrollmentByUserId(userId: number) {
  return await prisma.enrollment.findUnique({
    where: {
      userId
    }
  });
}

async function createTicket(ticketTypeId: number, enrollmentId: number) {
  return await prisma.ticket.create({
    data: {
      ticketTypeId,
      enrollmentId,
      status: "RESERVED",
    }
  });
}

const ticketsRepository = {
  findTicketTypes, 
  findTickets,
  findEnrollmentByUserId,
  findTicketTypeById,
  createTicket,
};

export default ticketsRepository;
