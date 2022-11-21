import ticketsRepository from "@/repositories/tickets-repository";
import { Ticket, TicketType } from "@prisma/client";

async function getTicketTypesForEvent() {
  const result = await ticketsRepository.findTicketTypes();
  return result;
}

async function getTickets() {
  const eventTicket: Ticket = await ticketsRepository.findTickets();
  const ticketType: TicketType = (await ticketsRepository.findTicketTypes())[0];

  const fullTicket = {
    ...eventTicket,
    TicketType: ticketType
  };
  return fullTicket;
}

async function getEnrollmentByUserId(userId: number) {
  return ticketsRepository.findEnrollmentByUserId(userId);
}

async function postTicket(ticketTypeId: number, enrollmentId: number) {
  const newticket = await ticketsRepository.createTicket(ticketTypeId, enrollmentId);
  const ticketType = await ticketsRepository.findTicketTypeById(ticketTypeId);

  const fullTicket = {
    ...newticket,
    TicketType: ticketType
  };
  return fullTicket;
}

const ticketsService = {
  getTicketTypesForEvent,
  getTickets,
  getEnrollmentByUserId,
  postTicket,
};

export default ticketsService;
