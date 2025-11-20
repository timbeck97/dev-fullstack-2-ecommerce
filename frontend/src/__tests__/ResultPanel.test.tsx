import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { ResultPanel } from "../pages/ResultPanel";
import axiosApi from "../service/axiosService";

jest.spyOn(console, "error").mockImplementation(() => {});
jest.spyOn(window, "alert").mockImplementation(() => {});
jest.mock("../service/axiosService");
const mockedAxios = axiosApi as jest.Mocked<typeof axiosApi>;

describe("ResultPanel Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("exibe 'Carregando dados...' inicialmente", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: { totalVendasMes: 1000 } });
    render(<ResultPanel />);
    expect(screen.getByText(/Carregando dados/i)).toBeInTheDocument();
  });

  test("exibe dados corretamente após carregar", async () => {
    mockedAxios.get
      .mockResolvedValueOnce({ data: { totalVendasMes: 2522200 } }) 
      .mockResolvedValueOnce({
        data: { name: "Difusor", totalVendido: 120, totalValor: 3600 },
      }) 
      .mockResolvedValueOnce({
        data: [
          { id: 1, name: "Vela 1", quantity: 3 },
          { id: 2, name: "Home Spray", quantity: 2 },
        ],
      }); 

    render(<ResultPanel />);

    await waitFor(() => {
      expect(screen.getByText(/R\$ 2500.00/)).toBeInTheDocument();
      expect(screen.getByText("Difusor")).toBeInTheDocument();
      expect(screen.getByText("Vela 1")).toBeInTheDocument();
      expect(screen.getByText("Home Spray")).toBeInTheDocument();
    });
  });

  test("exibe mensagem se não houver produto mais vendido", async () => {
    mockedAxios.get
      .mockResolvedValueOnce({ data: { totalVendasMes: 1000 } }) 
      .mockRejectedValueOnce(new Error("Erro")) 
      .mockResolvedValueOnce({ data: [] }); 

    render(<ResultPanel />);

    await waitFor(() => {
      expect(
        screen.getByText(/Nenhum produto encontrado no período selecionado/i)
      ).toBeInTheDocument();
    });
  });

  test("exibe mensagem se não houver produtos com baixo estoque", async () => {
    mockedAxios.get
      .mockResolvedValueOnce({ data: { totalVendasMes: 1500 } })
      .mockResolvedValueOnce({
        data: { name: "Difusor", totalVendido: 100, totalValor: 2000 },
      })
      .mockResolvedValueOnce({ data: [] });

    render(<ResultPanel />);

    await waitFor(() => {
      expect(screen.getByText(/Nenhum produto com baixo estoque/i)).toBeInTheDocument();
    });
  });

  test("atualiza produto mais vendido ao clicar em 'Buscar'", async () => {
    mockedAxios.get
      .mockResolvedValueOnce({ data: { totalVendasMes: 1200 } })
      .mockResolvedValueOnce({
        data: { name: "Difusor", totalVendido: 10, totalValor: 100 },
      })
      .mockResolvedValueOnce({ data: [] });

    render(<ResultPanel />);

    await waitFor(() =>
      expect(screen.getByText(/R\$ 1200.00/)).toBeInTheDocument()
    );

    fireEvent.change(screen.getByLabelText(/Data Início/i), {
      target: { value: "2025-01-01" },
    });
    fireEvent.change(screen.getByLabelText(/Data Fim/i), {
      target: { value: "2025-01-31" },
    });

    fireEvent.click(screen.getByText(/Buscar/i));

    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith(
        "/dashboard/produto-mais-vendido",
        expect.objectContaining({
          params: { startDate: "2025-01-01", endDate: "2025-01-31" },
        })
      );
    });
  });
});
