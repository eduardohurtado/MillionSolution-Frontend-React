// src/pages/OwnersPage.test.tsx
import { render, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import OwnersPage from "../../pages/OwnersPage";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

test("displays owners from API", async () => {
  mockedAxios.get.mockResolvedValueOnce({
    data: [
      {
        id: "1",
        name: "John Doe",
        address: "123 St",
        photo: "test.jpg",
        birthday: "1990-01-01",
      },
    ],
  });

  render(<OwnersPage />);

  await waitFor(() => {
    expect(screen.getByText("John Doe")).toBeInTheDocument();
  });
});
