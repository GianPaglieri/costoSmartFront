import React, { useEffect, useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Box,
  Stack,
  Chip,
  Typography,
  Snackbar,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { DownloadOutlined as DownloadOutlinedIcon } from "@mui/icons-material";
import { Line } from "react-chartjs-2";
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import { obtenerVentas } from "../controllers/VentaController";
import { fetchListaPrecios } from "../controllers/ListaPreciosController";

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

const DAILY_RANGE = {
  hoy: "hoy",
  semana: "semana",
  mes: "mes",
  todo: "todo",
};

const formatCurrency = (value) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 2,
  }).format(value ?? 0);

const formatDateForTable = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return new Intl.DateTimeFormat("es-AR", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "America/Argentina/Buenos_Aires",
  }).format(date);
};

const toLocalDateKey = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return String(value).slice(0, 10);
  }
  const local = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const year = local.getFullYear();
  const month = String(local.getMonth() + 1).padStart(2, "0");
  const day = String(local.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const rangoLabel = {
  [DAILY_RANGE.hoy]: "hoy",
  [DAILY_RANGE.semana]: "ultimos 7 dias",
  [DAILY_RANGE.mes]: "este mes",
  [DAILY_RANGE.todo]: "todo",
};

const VentasScreen = () => {
  const [ventas, setVentas] = useState([]);
  const [precios, setPrecios] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [rango, setRango] = useState(DAILY_RANGE.todo);
  const [tortaFiltro, setTortaFiltro] = useState("todas");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [metric, setMetric] = useState("cantidad");
  const [hiddenNames, setHiddenNames] = useState(new Set());

  useEffect(() => {
    const handleSearch = (event) => setFiltro((event?.detail?.q || "").trim());
    window.addEventListener("ui:search", handleSearch);
    return () => window.removeEventListener("ui:search", handleSearch);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [ventasData, preciosData] = await Promise.all([
          obtenerVentas(),
          fetchListaPrecios().catch(() => []),
        ]);
        setVentas((ventasData || []).slice().sort((a, b) => b.ID - a.ID));
        setPrecios(preciosData || []);
      } catch (err) {
        console.error("Error al obtener las ventas:", err);
        setError("No se pudieron cargar las ventas. Intenta nuevamente.");
        setSnackbarOpen(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const tortaOptions = useMemo(() => {
    const entries = new Map();
    ventas.forEach((venta) => {
      const idRaw = venta.ID_TORTA ?? venta.Torta?.nombre_torta ?? "sin-id";
      const id = String(idRaw);
      if (!entries.has(id)) {
        entries.set(id, {
          id,
          label: venta.Torta?.nombre_torta ?? "Sin nombre",
        });
      }
    });
    return Array.from(entries.values()).sort((a, b) => a.label.localeCompare(b.label));
  }, [ventas]);

  const costoPorTorta = useMemo(() => {
    const map = new Map();
    (precios || []).forEach((precio) => {
      map.set(String(precio.id_torta ?? precio.id), Number(precio.costo_total || 0));
    });
    return map;
  }, [precios]);

  const filtrarVentas = (venta) => {
    const textoOk =
      venta.ID.toString().includes(filtro) ||
      venta.Torta?.nombre_torta?.toLowerCase?.().includes(filtro.toLowerCase()) ||
      String(venta.precio_torta ?? "").includes(filtro) ||
      String(venta.fecha_venta ?? "").includes(filtro);

    if (!textoOk) return false;
    if (tortaFiltro !== "todas" && String(venta.ID_TORTA ?? "") !== tortaFiltro) {
      return false;
    }

    if (rango === DAILY_RANGE.todo) return true;

    const fechaVenta = new Date(venta.fecha_venta);
    if (Number.isNaN(fechaVenta.getTime())) return true;

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    if (rango === DAILY_RANGE.hoy) {
      const start = new Date(end);
      start.setHours(0, 0, 0, 0);
      return fechaVenta >= start && fechaVenta <= end;
    }

    if (rango === DAILY_RANGE.semana) {
      const start = new Date(end);
      start.setDate(end.getDate() - 6);
      start.setHours(0, 0, 0, 0);
      return fechaVenta >= start && fechaVenta <= end;
    }

    if (rango === DAILY_RANGE.mes) {
      const start = new Date(end.getFullYear(), end.getMonth(), 1);
      start.setHours(0, 0, 0, 0);
      return fechaVenta >= start && fechaVenta <= end;
    }

    return true;
  };

  const ventasFiltradas = useMemo(
    () =>
      ventas
        .filter(filtrarVentas)
        .map((venta) => ({
          ...venta,
          fecha: new Date(venta.fecha_venta),
        }))
        .sort((a, b) => b.fecha - a.fecha),
    [ventas, filtro, rango, tortaFiltro]
  );

  const ingresosFiltrados = useMemo(
    () => ventasFiltradas.reduce((acc, venta) => acc + Number(venta.precio_torta || 0), 0),
    [ventasFiltradas]
  );

  const gananciasFiltradas = useMemo(
    () =>
      ventasFiltradas.reduce((acc, venta) => {
        const costo = costoPorTorta.get(String(venta.ID_TORTA ?? ""));
        const precio = Number(venta.precio_torta || 0);
        if (Number.isFinite(costo)) {
          return acc + (precio - costo);
        }
        return acc;
      }, 0),
    [ventasFiltradas, costoPorTorta]
  );

  const hiddenKey = useMemo(() => Array.from(hiddenNames).join("|"), [hiddenNames]);

  const chartData = useMemo(() => {
    const dateSet = new Set();
    const byTorta = new Map();

    ventasFiltradas.forEach((venta) => {
      const dateKey = toLocalDateKey(venta.fecha_venta);
      dateSet.add(dateKey);

      const torta = venta.Torta?.nombre_torta || "Sin nombre";
      if (!byTorta.has(torta)) {
        byTorta.set(torta, new Map());
      }
      const map = byTorta.get(torta);
      const current = map.get(dateKey) || 0;
      const value = metric === "cantidad" ? 1 : Number(venta.precio_torta || 0);
      map.set(dateKey, current + value);
    });

    const labels = Array.from(dateSet).sort();
    const palette = [
      "#1976d2",
      "#6a1b9a",
      "#2e7d32",
      "#ad1457",
      "#ef6c00",
      "#00838f",
      "#7b1fa2",
      "#1565c0",
      "#00897b",
      "#c2185b",
    ];
    let colorIdx = 0;

    const datasets = Array.from(byTorta.entries()).map(([torta, map]) => {
      const borderColor = palette[colorIdx % palette.length];
      const backgroundColor = `${borderColor}33`;
      colorIdx += 1;
      return {
        label: torta,
        data: labels.map((key) => map.get(key) || 0),
        borderColor,
        backgroundColor,
        pointRadius: 2,
        borderWidth: 2,
        tension: 0.35,
        fill: true,
        hidden: hiddenNames.has(torta),
      };
    });

    const filteredDatasets = datasets.filter((dataset) =>
      dataset.data.some((value) => Number(value) > 0)
    );

    return { labels, datasets: filteredDatasets };
  }, [ventasFiltradas, metric, hiddenKey, hiddenNames]);

  const handleExport = () => {
    const headers = ["Nombre Torta", "Precio", "Fecha de Venta"];
    const rows = ventasFiltradas.map((venta) => [
      `"${(venta.Torta?.nombre_torta || "").replace(/"/g, '""')}"`,
      formatCurrency(venta.precio_torta),
      formatDateForTable(venta.fecha_venta),
    ]);
    const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "ventas.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleToggleDataset = (label) => {
    setHiddenNames((prev) => {
      const next = new Set(prev);
      if (next.has(label)) {
        next.delete(label);
      } else {
        next.add(label);
      }
      return next;
    });
  };

  const closeSnackbar = () => setSnackbarOpen(false);

  return (
    <Box sx={{ maxWidth: 1100, mx: "auto", mb: 3, px: 1 }}>
      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        sx={{ mb: 1.5, flexWrap: "wrap", gap: 1 }}
      >
        <Chip label={`Ventas (${rangoLabel[rango]}): ${ventasFiltradas.length}`} variant="outlined" />
        <Chip
          label={`Ingresos (${rangoLabel[rango]}): ${formatCurrency(ingresosFiltrados)}`}
          color="secondary"
          variant="outlined"
        />
        <Chip
          label={`Ganancias (${rangoLabel[rango]}): ${formatCurrency(gananciasFiltradas)}`}
          color="success"
          variant="outlined"
        />
        <Box sx={{ flexGrow: 1 }} />
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel id="torta-filter-label">Torta</InputLabel>
          <Select
            labelId="torta-filter-label"
            label="Torta"
            value={tortaFiltro}
            onChange={(event) => setTortaFiltro(event.target.value)}
          >
            <MenuItem value="todas">Todas</MenuItem>
            {tortaOptions.map((option) => (
              <MenuItem key={option.id} value={option.id}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Stack direction="row" spacing={1}>
          <Button
            size="small"
            variant={rango === DAILY_RANGE.todo ? "contained" : "outlined"}
            onClick={() => setRango(DAILY_RANGE.todo)}
          >
            Todo
          </Button>
          <Button
            size="small"
            variant={rango === DAILY_RANGE.hoy ? "contained" : "outlined"}
            onClick={() => setRango(DAILY_RANGE.hoy)}
          >
            Hoy
          </Button>
          <Button
            size="small"
            variant={rango === DAILY_RANGE.semana ? "contained" : "outlined"}
            onClick={() => setRango(DAILY_RANGE.semana)}
          >
            7 dias
          </Button>
          <Button
            size="small"
            variant={rango === DAILY_RANGE.mes ? "contained" : "outlined"}
            onClick={() => setRango(DAILY_RANGE.mes)}
          >
            Mes
          </Button>
          <Button
            size="small"
            variant="contained"
            color="primary"
            startIcon={<DownloadOutlinedIcon />}
            onClick={handleExport}
          >
            Exportar
          </Button>
        </Stack>
      </Stack>

      <Paper elevation={3} sx={{ p: 2, mb: 2, border: "1px solid #ddd", maxHeight: 360, overflow: "hidden" }}>
        {loading ? (
          <Box sx={{ display: "grid", placeItems: "center", height: 280 }}>
            <CircularProgress size={32} />
          </Box>
        ) : chartData.labels.length === 0 ? (
          <Box sx={{ height: 280, display: "grid", placeItems: "center", color: "text.secondary" }}>
            <Typography variant="body2">No hay datos para el rango seleccionado.</Typography>
          </Box>
        ) : (
          <>
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
              <Typography variant="h6">Resumen de ventas</Typography>
              <Stack direction="row" spacing={1}>
                <Button
                  size="small"
                  variant={metric === "cantidad" ? "contained" : "outlined"}
                  onClick={() => setMetric("cantidad")}
                >
                  Cantidad
                </Button>
                <Button
                  size="small"
                  variant={metric === "ingresos" ? "contained" : "outlined"}
                  onClick={() => setMetric("ingresos")}
                >
                  Ingresos
                </Button>
              </Stack>
            </Stack>
            <Box sx={{ height: 260 }}>
              <Line
                data={chartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: false },
                    tooltip: { intersect: false, mode: "index", padding: 12 },
                  },
                  elements: { point: { radius: 2 }, line: { tension: 0.35 } },
                  layout: { padding: { left: 6, right: 6, bottom: 18 } },
                  scales: {
                    x: {
                      ticks: {
                        maxRotation: 0,
                        minRotation: 0,
                        maxTicksLimit: 7,
                        padding: 10,
                        callback: (index) => {
                          const value = chartData.labels?.[index];
                          if (!value) return "";
                          const [year, month, day] = String(value).split("-");
                          return month && day ? `${month}-${day}` : String(value);
                        },
                      },
                      grid: { display: false },
                    },
                    y: {
                      beginAtZero: true,
                      ticks: { padding: 6 },
                    },
                  },
                }}
              />
            </Box>
            <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: "wrap" }}>
              {chartData.datasets.map((dataset) => (
                <Chip
                  key={dataset.label}
                  label={dataset.label}
                  onClick={() => handleToggleDataset(dataset.label)}
                  variant={hiddenNames.has(dataset.label) ? "outlined" : "filled"}
                  sx={{
                    bgcolor: hiddenNames.has(dataset.label)
                      ? "transparent"
                      : dataset.backgroundColor,
                    borderColor: dataset.borderColor,
                  }}
                  size="small"
                />
              ))}
            </Stack>
          </>
        )}
      </Paper>

      <Paper elevation={3} sx={{ border: "1px solid #ddd", maxHeight: 420, overflow: "hidden" }}>
        {loading ? (
          <Box sx={{ display: "grid", placeItems: "center", height: 200 }}>
            <CircularProgress size={28} />
          </Box>
        ) : (
          <TableContainer sx={{ maxHeight: 420 }}>
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>Nombre Torta</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }} align="right">
                    Precio
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Fecha de Venta</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {ventasFiltradas.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} align="center">
                      No hay ventas para el criterio seleccionado.
                    </TableCell>
                  </TableRow>
                ) : (
                  ventasFiltradas.map((venta) => (
                    <TableRow key={venta.ID} hover>
                      <TableCell>{venta.Torta?.nombre_torta || "Sin nombre"}</TableCell>
                      <TableCell align="right">{formatCurrency(venta.precio_torta)}</TableCell>
                      <TableCell>{formatDateForTable(venta.fecha_venta)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="error" onClose={closeSnackbar} sx={{ width: "100%" }}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default VentasScreen;
