import { jest } from "@jest/globals";
import rentalsRepository from "repositories/rentals-repository";
import rentalsService from "services/rentals-service";


describe("Rentals Service Unit Tests", () => {
  it("should can't rental if the user have pendent rental", async() => {
    jest
  .spyOn(rentalsRepository, "getRentalsByUserId")
  .mockImplementationOnce((): any => {
    return {
      id: 1,
      date: new Date("2015-11-13"),
      endDate: new Date("2015-11-16"),
      userId: 1,
      closed: true,
    };
  });
    const result = await rentalsService.checkUserAbleToRental(1);
    console.log(result)
    expect(result).toBe(true);
  });
});

it("should throw an error when user already have a rental", async () => {
  const mockUser: User = { id: 1, ...buildUserInput(true) }
  const mockRental: Rental = buildRentalReturn(mockUser.id, true)

  jest.spyOn(usersRepository, "getById").mockResolvedValueOnce(mockUser)
  jest.spyOn(rentalsRepository, "getRentalsByUserId").mockResolvedValueOnce([mockRental])

  const rentalInput: RentalInput = {
    userId: 1,
    moviesId: [1, 2, 3]
  }
  const promise = rentalsService.createRental(rentalInput)
  expect(promise).rejects.toEqual({
    name: "PendentRentalError",
    message: "The user already have a rental!"
  })
})

it("should throw an error when a minor user wants to rent a adults only movie", async () => {
  const mockUser: User = { id: 1, ...buildUserInput(false) }
  const mockMovie: Movie = { id: 1, rentalId: null, ...buildMovieInput(true) }

  jest.spyOn(usersRepository, "getById").mockResolvedValueOnce(mockUser)
  jest.spyOn(rentalsRepository, "getRentalsByUserId").mockResolvedValueOnce([])
  jest.spyOn(moviesRepository, "getById").mockResolvedValueOnce(mockMovie)

  const rentalInput: RentalInput = {
    userId: mockUser.id,
    moviesId: [mockMovie.id]
  }

  const promise = rentalsService.createRental(rentalInput)
  expect(promise).rejects.toEqual({
    name: "InsufficientAgeError",
    message: "Cannot see that movie."
  })
})

it("should throw an error when movie is not available", async () => {
  const mockUser: User = { id: 1, ...buildUserInput(true) }
  const mockMovie: Movie = { id: 1, rentalId: 2, ...buildMovieInput(true) }

  jest.spyOn(usersRepository, "getById").mockResolvedValueOnce(mockUser)
  jest.spyOn(rentalsRepository, "getRentalsByUserId").mockResolvedValueOnce([])
  jest.spyOn(moviesRepository, "getById").mockResolvedValueOnce(mockMovie)

  const rentalInput: RentalInput = {
    userId: mockUser.id,
    moviesId: [mockMovie.id]
  }

  const promise = rentalsService.createRental(rentalInput)
  expect(promise).rejects.toEqual({
    name: "MovieInRentalError",
    message: "Movie already in a rental."
  })
})

