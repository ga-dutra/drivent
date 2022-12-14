import app, { init } from "@/app";
import httpStatus from "http-status";
import * as jwt from "jsonwebtoken";
import supertest from "supertest";
import { cleanDb, generateValidToken } from "../helpers";
import faker from "@faker-js/faker";
import { createEnrollmentWithAddress, createPayment, createTicket, createTicketTypeRemote, createTicketTypeWithHotel, createUser } from "../factories";
import { createHotel, createRoom } from "../factories/hotels-factory";
import { TicketStatus } from "@prisma/client";

const server = supertest(app);

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

describe("GET /hotels", () => {
  it("should respond with status 401 if no token is given", async () => {
    const response = await server.get("/hotels");
    
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();

    const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if there is no session for given token", async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("when token is valid", () => {
    it("should respond with status 402 when user ticket is remote ", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeRemote();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await createPayment(ticket.id, ticketType.price);

      const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
    });

    it("should respond with status 404 when user has no enrollment ", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      await createTicketTypeRemote();

      const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it("should respond with status 200 and empty array when there are no hotels", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

      const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.OK);
      expect(response.body).toEqual([]);
    });
  });

  it("should respond with status 200 and with hotels data", async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketTypeWithHotel();
    const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
    await createPayment(ticket.id, ticketType.price);

    const createdHotel = await createHotel();

    const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

    expect(response.status).toEqual(httpStatus.OK);

    expect(response.body[0]).toEqual({
      id: createdHotel.id,
      name: createdHotel.name,
      image: createdHotel.image,
      createdAt: createdHotel.createdAt.toISOString(),
      updatedAt: createdHotel.updatedAt.toISOString(),
    });
  });
});

describe("GET /hotels/:hotelId", () => {
  it("should respond with status 401 if no token is given", async () => {
    const response = await server.get("/hotels/:hotelId");
    
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();

    const response = await server.get("/hotels/:hotelId").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if there is no session for given token", async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get("/hotels/:hotelId").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("when token is valid", () => {
    it("should respond with status 400 if hotelId params is not given", async () => {
      const token = await generateValidToken();
  
      const response = await server.get("/hotels/hotelId?hotelId=").set("Authorization", `Bearer ${token}`);
  
      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    it("should respond with status 400 if hotelId params is not a valid number", async () => {
      const token = await generateValidToken();
  
      const response = await server.get(`/hotels/hotelId?hotelId=${faker.word.noun()}`).set("Authorization", `Bearer ${token}`);
  
      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    it("should respond with status 404 if hotelId given does not exist in database", async () => {
      const token = await generateValidToken();
  
      const response = await server.get("/hotels/hotelId?hotelId=2").set("Authorization", `Bearer ${token}`);
  
      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it("should respond with status 200 and empty array when there are no rooms in given hotel", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await createPayment(ticket.id, ticketType.price);

      const hotel = await createHotel();
      const response = await server.get(`/hotels/hotelId?hotelId=${hotel.id}`).set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.OK);
      expect(response.body).toEqual([]);
    });

    it("should respond with status 200 and rooms data for given hotel", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await createPayment(ticket.id, ticketType.price);

      const hotel = await createHotel();
      const room = await createRoom(hotel.id);
      const response = await server.get(`/hotels/hotelId?hotelId=${hotel.id}`).set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.OK);
      expect(response.body[0]).toEqual({
        id: room.id,
        name: room.name,
        hotelId: hotel.id,
        capacity: room.capacity,
        createdAt: room.createdAt.toISOString(),
        updatedAt: room.updatedAt.toISOString(),
      });
    });
  });
});
