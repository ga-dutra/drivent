import paymentRepository from "@/repositories/payments-repository";

async function getTicketById(ticketId: number) {
  const ticket = await paymentRepository.findTicketById(ticketId);
  return ticket;
}

async function getPaymentById(ticketId: number) {
  const payment = await paymentRepository.findPaymentById(ticketId);
  return payment;
}

const paymentsService = {
  getTicketById,
  getPaymentById,
};

export default paymentsService;
