import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { SupplierForm } from "../pages/SupplierForm";
import axiosApi from "../service/axiosService";
import { BrowserRouter } from "react-router-dom";

jest.mock("../service/axiosService", () => ({
  get: jest.fn().mockResolvedValue({ data: { name: "Fornecedor A" } }),
  post: jest.fn(),
  put: jest.fn(),
}));
jest.spyOn(console, "error").mockImplementation(() => {});
jest.spyOn(window, "alert").mockImplementation(() => {});
const mockedAxios = axiosApi as jest.Mocked<typeof axiosApi>;


const mockNavigate = jest.fn();
const mockUseParams = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
  useParams: () => mockUseParams(),
}));


global.alert = jest.fn();

const renderWithRouter = (ui: React.ReactElement) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe("SupplierForm component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renderiza corretamente o formulário de novo fornecedor", () => {
    mockUseParams.mockReturnValue({ id: "novo" });

    renderWithRouter(<SupplierForm />);

    expect(screen.getByText("Novo Fornecedor")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Nome do fornecedor")).toBeInTheDocument();
    expect(screen.getByText("Salvar")).toBeInTheDocument();
  });

  test("atualiza campos de formulário ao digitar", () => {
    mockUseParams.mockReturnValue({ id: "novo" });

    renderWithRouter(<SupplierForm />);

    const nomeInput = screen.getByPlaceholderText("Nome do fornecedor");
    fireEvent.change(nomeInput, { target: { value: "Fornecedor Teste" } });

    expect(nomeInput).toHaveValue("Fornecedor Teste");
  });

  test("faz POST ao salvar novo fornecedor", async () => {
    mockUseParams.mockReturnValue({ id: "novo" });
    mockedAxios.post.mockResolvedValueOnce({});

    renderWithRouter(<SupplierForm />);

    const nomeInput = screen.getByPlaceholderText("Nome do fornecedor");
    fireEvent.change(nomeInput, { target: { value: "Fornecedor A" } });

    const salvarBtn = screen.getByText("Salvar");
    fireEvent.click(salvarBtn);

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith("/suppliers", expect.objectContaining({
        name: "Fornecedor A",
      }));
      expect(global.alert).toHaveBeenCalledWith("Fornecedor cadastrado com sucesso!");
      expect(mockNavigate).toHaveBeenCalledWith("/manage/suppliers");
    });
  });

  test("faz GET ao editar fornecedor existente", async () => {
    mockUseParams.mockReturnValue({ id: "10" });
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        id: 10,
        name: "Fornecedor Antigo",
        email: "old@mail.com",
        phone: "9999-9999",
        address: "Rua 1",
        cnpj: "00.000.000/0001-00",
      },
    });

    renderWithRouter(<SupplierForm />);

    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith("http://localhost:5000/suppliers/10");
      expect(screen.getByDisplayValue("Fornecedor Antigo")).toBeInTheDocument();
    });
  });

  test("faz PUT ao salvar fornecedor existente", async () => {
    mockUseParams.mockReturnValue({ id: "10" });
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        id: 10,
        name: "Fornecedor Antigo",
        email: "old@mail.com",
        phone: "9999-9999",
        address: "Rua 1",
        cnpj: "00.000.000/0001-00",
      },
    });
    mockedAxios.put.mockResolvedValueOnce({});

    renderWithRouter(<SupplierForm />);

    await waitFor(() =>
      expect(screen.getByDisplayValue("Fornecedor Antigo")).toBeInTheDocument()
    );

    const nomeInput = screen.getByDisplayValue("Fornecedor Antigo");
    fireEvent.change(nomeInput, { target: { value: "Fornecedor Atualizado" } });

    const salvarBtn = screen.getByText("Salvar");
    fireEvent.click(salvarBtn);

    await waitFor(() => {
      expect(mockedAxios.put).toHaveBeenCalledWith(
        "/suppliers/10",
        expect.objectContaining({ name: "Fornecedor Atualizado" })
      );
      expect(global.alert).toHaveBeenCalledWith("Fornecedor atualizado com sucesso!");
      expect(mockNavigate).toHaveBeenCalledWith("/manage/suppliers");
    });
  });

  test("exibe alerta em caso de erro ao carregar fornecedor", async () => {
    mockUseParams.mockReturnValue({ id: "5" });
    mockedAxios.get.mockRejectedValueOnce(new Error("Erro de rede"));

    renderWithRouter(<SupplierForm />);

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith("Erro ao carregar fornecedor.");
    });
  });

  test("navega ao clicar em 'Voltar'", () => {
    mockUseParams.mockReturnValue({ id: "novo" });

    renderWithRouter(<SupplierForm />);

    fireEvent.click(screen.getByText("Voltar"));
    expect(mockNavigate).toHaveBeenCalledWith("/manage/suppliers");
  });
});
