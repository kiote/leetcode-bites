import { render, screen } from "@testing-library/react";
import App from "../App";
import * as versionManager from "../utils/versionManager";

// Mock react-router-dom
jest.mock("react-router-dom", () => ({
  BrowserRouter: ({ children }) => (
    <div data-testid="browser-router">{children}</div>
  ),
  Routes: ({ children }) => <div data-testid="routes">{children}</div>,
  Route: ({ element, path }) => (
    <div data-testid="route" data-path={path}>
      {element}
    </div>
  ),
  Link: ({ children, to }) => (
    <a href={to} data-testid="link">
      {children}
    </a>
  ),
}));

// Mock the components that use react-router-dom
jest.mock("../components/AboutPage", () => () => (
  <div data-testid="about-page">About Page</div>
));
jest.mock("../components/BurgerMenu", () => () => (
  <div data-testid="burger-menu">Burger Menu</div>
));

// Mock the version manager
jest.mock("../utils/versionManager", () => ({
  getAppVersion: jest.fn(),
}));

describe("App Component", () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  test("renders App component with router structure", () => {
    // Mock the version returned
    const mockVersion = "1.2.3";
    versionManager.getAppVersion.mockReturnValue(mockVersion);

    // Render the App component
    render(<App />);

    // Verify router structure is present
    expect(screen.getByTestId("browser-router")).toBeInTheDocument();
    expect(screen.getByTestId("routes")).toBeInTheDocument();
    expect(screen.getByTestId("burger-menu")).toBeInTheDocument();

    // Check if main title is rendered (should be on home route)
    expect(
      screen.getAllByText(/Master leetcode-style interviews/i).length
    ).toBeGreaterThan(0);

    // Check if the footer is in the document with version
    const footerElement = screen.getByTestId("app-version");
    expect(footerElement).toBeInTheDocument();
    expect(footerElement.textContent).toBe(`v${mockVersion}`);
  });
});
