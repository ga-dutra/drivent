import app, { init } from "@/app";
import httpStatus from "http-status";
import * as jwt from "jsonwebtoken";
import supertest from "supertest";
import { cleanDb, generateValidToken } from "../helpers";
import faker from "@faker-js/faker";
import { createEnrollmentWithAddress, createPayment, createTicket, createTicketType, createTicketTypeWithHotel, createUser } from "../factories";
import { TicketStatus } from "@prisma/client";
import { createHotel, createRoom } from "../factories/hotels-factory";
import { createBooking } from "../factories/booking-factory";

const server = supertest(app);

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

describe("GET /booking", () => {
  it("should respond with status 401 if no token is given", async () => {
    const response = await server.get("/booking");
    
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();

    const response = await server.get("/booking").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if there is no session for given token", async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("when token is valid", () => {
    it("should respond with status 404 if there are no bookings", async () => {
      const user = await createUser();
      const token = await generateValidToken(user); 
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await createPayment(ticket.id, ticketType.price);
    
      const response = await server.get("/booking").set("Authorization", `Bearer ${token}`);
      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it("should respond with status 200 and booking data", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const hotel = await createHotel();
      const room = await createRoom(hotel.id);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await createPayment(ticket.id, ticketType.price);
      const booking = await createBooking(user.id, room.id);

      const response = await server.get("/booking").set("Authorization", `Bearer ${token}`);
      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual({
        id: booking.id,
        Room: {
          id: room.id,
          capacity: room.capacity,
          hotelId: room.hotelId,
          name: room.name,
          createdAt: room.createdAt.toISOString(),
          updatedAt: room.updatedAt.toISOString(),
        }
      });
    });
  });
});

describe("POST /booking", () => {
  describe("when token is invalid", () => {
    it("should respond with status 401 if no token is given", async () => {
      const response = await server.post("/booking");
      
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
  
    it("should respond with status 401 if given token is not valid", async () => {
      const token = faker.lorem.word();
  
      const response = await server.post("/booking").set("Authorization", `Bearer ${token}`);
  
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
  
    it("should respond with status 401 if there is no session for given token", async () => {
      const userWithoutSession = await createUser();
      const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
  
      const response = await server.post("/hotels").set("Authorization", `Bearer ${token}`);
  
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
  });

  describe("when token is valid", () => {
    it("should respond with status 400 if roomId is missing", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
    
      const response = await server.post("/booking").set("Authorization", `Bearer ${token}`);
      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    it("should respond with status 400 if roomId is not a number", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
    
      const response = await server.post("/booking").set("Authorization", `Bearer ${token}`).send({ roomId: faker.random.word });
      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    it("should respond with status 400 if roomId is not a valid number", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
    
      const response = await server.post("/booking").set("Authorization", `Bearer ${token}`).send({ roomId: faker.datatype.number({ min: -999, max: -1 }) });
      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    it("should respond with status 404 if there is no enrollment", async () => {
      const token = await generateValidToken(); 
      const hotel = await createHotel();
      const room = await createRoom(hotel.id);
    
      const response = await server.post("/booking").set("Authorization", `Bearer ${token}`).send({ roomId: room.id });
      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it("should respond with status 404 if user doesnt have a ticket", async () => {
      const user = await createUser();
      const token = await generateValidToken(user); 
      await createEnrollmentWithAddress(user);
      await createTicketTypeWithHotel();
      const hotel = await createHotel();
      const room = await createRoom(hotel.id);
    
      const response = await server.post("/booking").set("Authorization", `Bearer ${token}`).send({ roomId: room.id });
      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });
  });
});
