import ticketsRepository from "@/repositories/tickets-repository";

async function getTicketTypesForEvent() {
  const result = await ticketsRepository.findTicketTypes();
  return result;
}

const ticketsService = {
  getTicketTypesForEvent
};

export default ticketsService;
